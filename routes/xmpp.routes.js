const express = require("express")
const router = express.Router()

// Simplified XMPP routes for development

// Send a message
router.post("/message", (req, res) => {
  const { to, message } = req.body
  res.json({
    success: true,
    message: "Message sent successfully (development mode)",
  })
})

// Update presence
router.post("/presence", (req, res) => {
  const { status } = req.body
  res.json({
    success: true,
    message: "Presence updated successfully (development mode)",
  })
})

module.exports = router
