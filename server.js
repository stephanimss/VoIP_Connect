require("dotenv").config()
const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const db = require("./config/database")
const xmpp = require("./services/xmpp.service")
const userRoutes = require('./routes/userRoutes');

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(express.json())

// Routes
app.use("/api/users", userRoutes)

// Start server
const PORT = process.env.PORT || 5001
httpServer.listen(PORT, () => {
  console.log("userRoutes file:", require.resolve("./routes/userRoutes"));
})

// Initialize database and XMPP
db.connect()
xmpp.connect(io)
