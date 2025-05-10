const express = require("express")
const router = express.Router()
const callController = require("../controllers/call.controller")
const { authenticate } = require("../middleware/auth.middleware")

// All routes require authentication
router.use(authenticate)

// Initiate a call
router.post("/initiate", callController.initiateCall)

// Answer a call
router.post("/answer", callController.answerCall)

// End a call
router.post("/end", callController.endCall)

// Get call history
router.get("/history", callController.getCallHistory)

// Get call details
router.get("/:callId", callController.getCallDetails)

module.exports = router
