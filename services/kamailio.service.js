// Simplified Kamailio service for development
const axios = require("axios")

// Connect to Kamailio server - simplified for development
const connectToKamailio = async () => {
  console.log("Kamailio connection skipped in development mode")
  return true
}

// Register a user with Kamailio - simplified for development
const registerUser = async (phoneNumber, password, displayName) => {
  console.log(`Kamailio registration for user ${phoneNumber} skipped in development mode`)
  return { success: true, message: "User registered with Kamailio (development mode)" }
}

// Create a SIP client for a user - simplified for development
const createSIPClient = (phoneNumber, password) => {
  console.log(`SIP client creation for ${phoneNumber} skipped in development mode`)
  return {
    on: (event, callback) => {
      console.log(`SIP client registered event handler for ${event}`)
    },
  }
}

// Initiate a call - simplified for development
const initiateCall = async (caller, callee, callType) => {
  console.log(`Call initiation from ${caller} to ${callee} (${callType}) skipped in development mode`)
  return {
    success: true,
    callId: "dev-call-" + Date.now(),
    sessionId: "dev-session-" + Date.now(),
  }
}

// Answer a call - simplified for development
const answerCall = async (phoneNumber, sessionId, withVideo = false) => {
  console.log(`Call answer by ${phoneNumber} for session ${sessionId} skipped in development mode`)
  return { success: true, callId: "dev-call-" + Date.now() }
}

// End a call - simplified for development
const endCall = async (sessionId) => {
  console.log(`Call end for session ${sessionId} skipped in development mode`)
  return { success: true, callId: "dev-call-" + Date.now() }
}

module.exports = {
  connectToKamailio,
  registerUser,
  createSIPClient,
  initiateCall,
  answerCall,
  endCall,
}
function connectToKamailio() {
  console.log("Connecting to Kamailio...");
  // implementasi koneksi sebenarnya di sini
}

module.exports = {
  connectToKamailio
};
