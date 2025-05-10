const express = require("express")
const router = express.Router()
const { authenticate } = require("../middleware/auth.middleware")
const { registerUser } = require("../services/kamailio.service")

// All routes require authentication
router.use(authenticate)

// Register with Kamailio
router.post("/register", async (req, res, next) => {
  try {
    const { password, displayName } = req.body
    const phoneNumber = req.user.phoneNumber

    const result = await registerUser(phoneNumber, password, displayName || phoneNumber)

    res.status(200).json({
      success: true,
      message: "Registered with Kamailio successfully",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
