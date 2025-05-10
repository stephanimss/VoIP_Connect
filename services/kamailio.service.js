const axios = require("axios")
const SIPClient = require("sip.js").UA
const User = require("../models/user.model")
const Call = require("../models/call.model")

// Kamailio server configuration
const KAMAILIO_HOST = process.env.KAMAILIO_HOST || "localhost"
const KAMAILIO_PORT = process.env.KAMAILIO_PORT || 5060
const KAMAILIO_API_URL = process.env.KAMAILIO_API_URL || "http://localhost:8080/api"
const KAMAILIO_ADMIN_USER = process.env.KAMAILIO_ADMIN_USER || "admin"
const KAMAILIO_ADMIN_PASSWORD = process.env.KAMAILIO_ADMIN_PASSWORD || "kamailiorocks"

// Active calls
const activeCalls = new Map()

// Connect to Kamailio server
const connectToKamailio = async () => {
  try {
    // Test connection to Kamailio API
    const response = await axios.get(`${KAMAILIO_API_URL}/status`, {
      auth: {
        username: KAMAILIO_ADMIN_USER,
        password: KAMAILIO_ADMIN_PASSWORD,
      },
    })

    console.log("Connected to Kamailio server:", response.data)
    return true
  } catch (error) {
    console.error("Failed to connect to Kamailio server:", error.message)
    return false
  }
}

// Register a user with Kamailio
const registerUser = async (phoneNumber, password, displayName) => {
  try {
    // Check if user already exists in Kamailio
    const checkUser = await axios
      .get(`${KAMAILIO_API_URL}/subscribers/${phoneNumber}`, {
        auth: {
          username: KAMAILIO_ADMIN_USER,
          password: KAMAILIO_ADMIN_PASSWORD,
        },
      })
      .catch(() => ({ data: { exists: false } }))

    if (checkUser.data.exists) {
      // Update existing user
      await axios.put(
        `${KAMAILIO_API_URL}/subscribers/${phoneNumber}`,
        {
          password,
          display_name: displayName,
        },
        {
          auth: {
            username: KAMAILIO_ADMIN_USER,
            password: KAMAILIO_ADMIN_PASSWORD,
          },
        },
      )
    } else {
      // Create new user
      await axios.post(
        `${KAMAILIO_API_URL}/subscribers`,
        {
          username: phoneNumber,
          domain: KAMAILIO_HOST,
          password,
          display_name: displayName,
        },
        {
          auth: {
            username: KAMAILIO_ADMIN_USER,
            password: KAMAILIO_ADMIN_PASSWORD,
          },
        },
      )
    }

    return { success: true, message: "User registered with Kamailio" }
  } catch (error) {
    console.error("Kamailio user registration error:", error.message)
    throw new Error("Failed to register user with Kamailio")
  }
}

// Create a SIP client for a user
const createSIPClient = (phoneNumber, password) => {
  try {
    const sipUri = `sip:${phoneNumber}@${KAMAILIO_HOST}`

    // Configure SIP.js UA (User Agent)
    const config = {
      uri: sipUri,
      password: password,
      wsServers: [`wss://${KAMAILIO_HOST}:8443`],
      register: true,
      traceSip: true,
      userAgentString: "VoIP Integration Client",
    }

    // Create new SIP client
    const sipClient = new SIPClient(config)

    // Setup event handlers
    sipClient.on("registered", () => {
      console.log(`SIP client registered for ${phoneNumber}`)
    })

    sipClient.on("unregistered", () => {
      console.log(`SIP client unregistered for ${phoneNumber}`)
    })

    sipClient.on("invite", (session) => {
      // Handle incoming call
      handleIncomingCall(phoneNumber, session)
    })

    return sipClient
  } catch (error) {
    console.error("SIP client creation error:", error)
    throw error
  }
}

// Initiate a call
const initiateCall = async (caller, callee, callType) => {
  try {
    // Get caller's SIP client
    const sipClient = getSIPClient(caller)
    if (!sipClient) {
      throw new Error("Caller not registered")
    }

    // Create SIP URI for callee
    const calleeUri = `sip:${callee}@${KAMAILIO_HOST}`

    // Set call options based on type (audio/video)
    const options = {
      media: {
        constraints: {
          audio: true,
          video: callType === "video",
        },
      },
    }

    // Initiate session
    const session = sipClient.invite(calleeUri, options)

    // Create call record
    const call = new Call({
      caller,
      callee,
      callType,
      status: "calling",
      startTime: new Date(),
    })
    await call.save()

    // Store active call
    activeCalls.set(session.id, {
      callId: call._id,
      caller,
      callee,
      callType,
      session,
    })

    // Setup session event handlers
    setupCallEventHandlers(session, call._id)

    return {
      success: true,
      callId: call._id,
      sessionId: session.id,
    }
  } catch (error) {
    console.error("Call initiation error:", error)
    throw error
  }
}

// Handle incoming call
const handleIncomingCall = async (phoneNumber, session) => {
  try {
    // Extract caller information
    const caller = session.remoteIdentity.uri.user

    // Determine call type from session description
    const hasVideo = session.request.body.indexOf("m=video") !== -1
    const callType = hasVideo ? "video" : "voice"

    // Create call record
    const call = new Call({
      caller,
      callee: phoneNumber,
      callType,
      status: "ringing",
      startTime: new Date(),
    })
    await call.save()

    // Store active call
    activeCalls.set(session.id, {
      callId: call._id,
      caller,
      callee: phoneNumber,
      callType,
      session,
    })

    // Setup session event handlers
    setupCallEventHandlers(session, call._id)

    // Notify user of incoming call (via WebSocket or other means)
    notifyIncomingCall(phoneNumber, {
      callId: call._id,
      sessionId: session.id,
      caller,
      callType,
    })
  } catch (error) {
    console.error("Incoming call handling error:", error)
    // Reject call on error
    session.reject()
  }
}

// Setup call event handlers
const setupCallEventHandlers = (session, callId) => {
  // Call accepted
  session.on("accepted", async () => {
    await Call.findByIdAndUpdate(callId, {
      $set: {
        status: "in-progress",
        answeredAt: new Date(),
      },
    })
  })

  // Call ended
  session.on("terminated", async () => {
    const call = activeCalls.get(session.id)
    if (call) {
      await Call.findByIdAndUpdate(callId, {
        $set: {
          status: "ended",
          endTime: new Date(),
        },
      })
      activeCalls.delete(session.id)
    }
  })

  // Call failed
  session.on("failed", async () => {
    await Call.findByIdAndUpdate(callId, {
      $set: {
        status: "failed",
        endTime: new Date(),
      },
    })
    activeCalls.delete(session.id)
  })
}

// Answer a call
const answerCall = async (phoneNumber, sessionId, withVideo = false) => {
  try {
    const call = activeCalls.get(sessionId)
    if (!call) {
      throw new Error("Call not found")
    }

    // Set answer options
    const options = {
      media: {
        constraints: {
          audio: true,
          video: withVideo || call.callType === "video",
        },
      },
    }

    // Answer the call
    call.session.accept(options)

    return { success: true, callId: call.callId }
  } catch (error) {
    console.error("Call answer error:", error)
    throw error
  }
}

// End a call
const endCall = async (sessionId) => {
  try {
    const call = activeCalls.get(sessionId)
    if (!call) {
      throw new Error("Call not found")
    }

    // End the call
    call.session.terminate()

    return { success: true, callId: call.callId }
  } catch (error) {
    console.error("Call end error:", error)
    throw error
  }
}

// Get SIP client for a user
const getSIPClient = (phoneNumber) => {
  // In a real implementation, this would retrieve the SIP client from a store
  // For this example, we'll create a new one each time
  return createSIPClient(phoneNumber, "password")
}

// Notify user of incoming call
const notifyIncomingCall = (phoneNumber, callInfo) => {
  // In a real implementation, this would send a notification via WebSocket
  console.log(`Notifying ${phoneNumber} of incoming call from ${callInfo.caller}`)
}

module.exports = {
  connectToKamailio,
  registerUser,
  createSIPClient,
  initiateCall,
  answerCall,
  endCall,
}
