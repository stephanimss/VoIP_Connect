const express = require("express")
const router = express.Router()
const { authenticate } = require("../middleware/auth.middleware")
const { sendMessage, updateUserPresence } = require("../services/xmpp.service")

// All routes require authentication
router.use(authenticate)

// Send a message
router.post("/message", async (req, res, next) => {
  try {
    const { to, message } = req.body
    const from = req.user.phoneNumber

    const result = await sendMessage(from, to, message)

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    next(error)
  }
})

// Update presence
router.post("/presence", async (req, res, next) => {
  try {
    const { status } = req.body
    const jid = `${req.user.phoneNumber}@voip.local`

    await updateUserPresence(jid, status)

    res.status(200).json({
      success: true,
      message: "Presence updated successfully",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
