// Simplified Socket.io service for development

// Connected users map
const connectedUsers = new Map()

// Setup Socket.io server - simplified for development
const setupSocketServer = (io) => {
  console.log("Socket.io server setup in development mode")

  // Basic Socket.io setup
  io.on("connection", (socket) => {
    console.log("New client connected")

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected")

      // Remove from connected users if authenticated
      if (socket.user) {
        connectedUsers.delete(socket.user.phoneNumber)
        console.log(`User disconnected: ${socket.user.phoneNumber}`)
      }
    })

    // Handle authentication
    socket.on("authenticate", (data) => {
      // In development mode, just accept any authentication
      socket.user = {
        id: 1,
        phoneNumber: data.phoneNumber || "1234567890",
        name: data.name || "Test User",
      }

      // Store user connection
      connectedUsers.set(socket.user.phoneNumber, socket)
      console.log(`User authenticated: ${socket.user.phoneNumber}`)

      // Acknowledge authentication
      socket.emit("authenticated", { success: true })
    })

    // Handle call signaling
    socket.on("call:offer", (data) => {
      console.log(`Call offer received from ${socket.user?.phoneNumber || "unknown"} to ${data.target}`)
      // In development mode, just echo back
      socket.emit("call:offer:ack", { success: true })
    })

    socket.on("call:answer", (data) => {
      console.log(`Call answer received from ${socket.user?.phoneNumber || "unknown"}`)
      // In development mode, just echo back
      socket.emit("call:answer:ack", { success: true })
    })

    socket.on("call:end", (data) => {
      console.log(`Call end received from ${socket.user?.phoneNumber || "unknown"}`)
      // In development mode, just echo back
      socket.emit("call:end:ack", { success: true })
    })
  })

  return true
}

module.exports = {
  setupSocketServer,
  connectedUsers,
}
