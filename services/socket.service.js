const { verifyJWT } = require("../utils/auth.utils")
const User = require("../models/user.model")

// Connected users
const connectedUsers = new Map()

// Setup Socket.io server
const setupSocketServer = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error("Authentication error: Token missing"))
      }

      // Verify token
      const decoded = verifyJWT(token)
      if (!decoded) {
        return next(new Error("Authentication error: Invalid token"))
      }

      // Get user from database
      const user = await User.findById(decoded.id)
      if (!user) {
        return next(new Error("Authentication error: User not found"))
      }

      // Attach user to socket
      socket.user = {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      }

      next()
    } catch (error) {
      console.error("Socket authentication error:", error)
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.phoneNumber}`)

    // Store user connection
    connectedUsers.set(socket.user.phoneNumber, socket)

    // Update user status to online
    updateUserStatus(socket.user.phoneNumber, "online")

    // Broadcast user online status
    socket.broadcast.emit("user:status", {
      phoneNumber: socket.user.phoneNumber,
      status: "online",
    })

    // Handle call signaling
    socket.on("call:offer", (data) => {
      handleCallOffer(socket, data)
    })

    socket.on("call:answer", (data) => {
      handleCallAnswer(socket, data)
    })

    socket.on("call:ice-candidate", (data) => {
      handleIceCandidate(socket, data)
    })

    socket.on("call:end", (data) => {
      handleCallEnd(socket, data)
    })

    // Handle user status updates
    socket.on("user:status", (data) => {
      updateUserStatus(socket.user.phoneNumber, data.status)
      socket.broadcast.emit("user:status", {
        phoneNumber: socket.user.phoneNumber,
        status: data.status,
      })
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.phoneNumber}`)

      // Remove user connection
      connectedUsers.delete(socket.user.phoneNumber)

      // Update user status to offline
      updateUserStatus(socket.user.phoneNumber, "offline")

      // Broadcast user offline status
      socket.broadcast.emit("user:status", {
        phoneNumber: socket.user.phoneNumber,
        status: "offline",
      })
    })
  })
}

// Update user status in database
const updateUserStatus = async (phoneNumber, status) => {
  try {
    await User.findOneAndUpdate(
      { phoneNumber },
      {
        $set: {
          status,
          lastSeen: new Date(),
        },
      },
    )
  } catch (error) {
    console.error("Update user status error:", error)
  }
}

// Handle WebRTC call offer
const handleCallOffer = (socket, data) => {
  try {
    const { target, offer, callType } = data

    // Get target socket
    const targetSocket = connectedUsers.get(target)
    if (!targetSocket) {
      // Target user not connected
      socket.emit("call:error", {
        message: "User is not available",
      })
      return
    }

    // Forward offer to target
    targetSocket.emit("call:offer", {
      caller: socket.user.phoneNumber,
      callerName: socket.user.name,
      offer,
      callType,
    })
  } catch (error) {
    console.error("Call offer error:", error)
    socket.emit("call:error", {
      message: "Failed to initiate call",
    })
  }
}

// Handle WebRTC call answer
const handleCallAnswer = (socket, data) => {
  try {
    const { target, answer } = data

    // Get target socket
    const targetSocket = connectedUsers.get(target)
    if (!targetSocket) {
      // Target user not connected
      socket.emit("call:error", {
        message: "User is not available",
      })
      return
    }

    // Forward answer to target
    targetSocket.emit("call:answer", {
      callee: socket.user.phoneNumber,
      calleeName: socket.user.name,
      answer,
    })
  } catch (error) {
    console.error("Call answer error:", error)
    socket.emit("call:error", {
      message: "Failed to answer call",
    })
  }
}

// Handle WebRTC ICE candidate
const handleIceCandidate = (socket, data) => {
  try {
    const { target, candidate } = data

    // Get target socket
    const targetSocket = connectedUsers.get(target)
    if (!targetSocket) {
      return
    }

    // Forward ICE candidate to target
    targetSocket.emit("call:ice-candidate", {
      from: socket.user.phoneNumber,
      candidate,
    })
  } catch (error) {
    console.error("ICE candidate error:", error)
  }
}

// Handle call end
const handleCallEnd = (socket, data) => {
  try {
    const { target } = data

    // Get target socket
    const targetSocket = connectedUsers.get(target)
    if (!targetSocket) {
      return
    }

    // Notify target that call has ended
    targetSocket.emit("call:end", {
      from: socket.user.phoneNumber,
    })
  } catch (error) {
    console.error("Call end error:", error)
  }
}

module.exports = {
  setupSocketServer,
  connectedUsers,
}
