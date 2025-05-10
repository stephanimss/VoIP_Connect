const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const { createServer } = require("http")
const { Server } = require("socket.io")
const { testConnection } = require("./config/database")
const { syncDatabase, sequelize } = require("./models/index")
const authRoutes = require("./routes/auth.routes")
const callRoutes = require("./routes/call.routes")
const xmppRoutes = require("./routes/xmpp.routes")
const kamailioRoutes = require("./routes/kamailio.routes")
const userRoutes = require("./routes/userRoutes") // Using your manually added file
const { setupSocketServer } = require("./services/socket.service")
const { connectToKamailio } = require("./services/kamailio.service")
const { setupXMPPServer } = require("./services/xmpp.service")

// Initialize Express app
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes) // Using your manually added userRoutes
app.use("/api/calls", callRoutes)
app.use("/api/xmpp", xmppRoutes)
app.use("/api/kamailio", kamailioRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to VoIP Integration API" })
})

// Add this route to test MySQL connection
app.get("/api/test-db", async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({ success: true, message: "Database connection is working!" })
  } catch (error) {
    console.error("Database connection error:", error)
    res.status(500).json({ success: false, message: "Database connection failed", error: error.message })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
})

// Start the server
const startServer = async () => {
  try {
    console.log("Starting server...")

    // Test database connection
    console.log("Testing database connection...")
    const dbConnected = await testConnection()
    if (!dbConnected) {
      console.error("Failed to connect to the database. Exiting...")
      process.exit(1)
    }
    console.log("Database connection successful!")

    // Sync database models
    console.log("Syncing database models...")
    await syncDatabase(false) // Set to true to force sync (drop and recreate tables)
    console.log("Database models synced!")

    // Setup XMPP server (simplified for development)
    console.log("Setting up XMPP server...")
    setupXMPPServer()
    console.log("XMPP server setup complete!")

    // Setup Socket.io for real-time communication
    console.log("Setting up Socket.io server...")
    setupSocketServer(io)
    console.log("Socket.io server setup complete!")

    // Connect to Kamailio SIP server (simplified for development)
    console.log("Connecting to Kamailio SIP server...")
    connectToKamailio()
    console.log("Kamailio SIP server connection complete!")

    // Start server
    const PORT = process.env.PORT || 5001
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API available at http://localhost:${PORT}/api`)
      console.log(`Test database connection at http://localhost:${PORT}/api/test-db`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Start the server
startServer()

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  // Don't crash the server, just log the error
})

module.exports = app
