const express = require("express")
const router = express.Router()

// Simplified call routes for development

// Get call history
router.get("/history", (req, res) => {
  res.json({
    success: true,
    calls: [
      {
        id: 1,
        caller: "1234567890",
        callee: "9876543210",
        callType: "voice",
        status: "ended",
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 3540000).toISOString(),
        duration: 60,
      },
      {
        id: 2,
        caller: "9876543210",
        callee: "1234567890",
        callType: "video",
        status: "ended",
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date(Date.now() - 7080000).toISOString(),
        duration: 120,
      },
    ],
  })
})

// Initiate a call
router.post("/initiate", (req, res) => {
  const { callee, callType } = req.body
  res.json({
    success: true,
    message: "Call initiated (development mode)",
    callId: "dev-call-" + Date.now(),
    sessionId: "dev-session-" + Date.now(),
  })
})

// Answer a call
router.post("/answer", (req, res) => {
  const { sessionId, withVideo } = req.body
  res.json({
    success: true,
    message: "Call answered (development mode)",
    callId: "dev-call-" + Date.now(),
  })
})

// End a call
router.post("/end", (req, res) => {
  const { sessionId } = req.body
  res.json({
    success: true,
    message: "Call ended (development mode)",
    callId: "dev-call-" + Date.now(),
  })
})

// Get call details
router.get("/:callId", (req, res) => {
  const { callId } = req.params
  res.json({
    success: true,
    call: {
      id: callId,
      caller: "1234567890",
      callee: "9876543210",
      callType: "voice",
      status: "ended",
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() - 3540000).toISOString(),
      duration: 60,
    },
  })
})

module.exports = router
