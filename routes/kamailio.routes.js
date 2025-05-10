const express = require("express")
const router = express.Router()

// Simplified Kamailio routes for development

// Register with Kamailio
router.post("/register", (req, res) => {
  const { password, displayName } = req.body
  res.json({
    success: true,
    message: "Registered with Kamailio successfully (development mode)",
  })
})

module.exports = router
