const { client } = require("@xmpp/client")

let xmppClient = null

module.exports = {
  connect: (io) => {
    xmppClient = client({
      service: `xmpp://${process.env.XMPP_SERVER}:${process.env.XMPP_PORT}`,
      domain: process.env.XMPP_DOMAIN,
      username: process.env.XMPP_ADMIN_JID,
      password: process.env.XMPP_ADMIN_PASSWORD,
    })

    xmppClient.on("online", (address) => {
      console.log(`Connected to XMPP server as ${address.toString()}`)
    })

    xmppClient.on("error", (err) => {
      console.error("XMPP connection error:", err)
    })

    xmppClient.start().catch(console.error)

    io.on("connection", (socket) => {
      console.log("New client connected via Socket.io")
      socket.on("message", (msg) => {
        console.log("Received message from client:", msg)
      })
    })
  },
}
