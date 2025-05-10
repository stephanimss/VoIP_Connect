const jwt = require("jsonwebtoken")
const { User } = require("../models/index")

// Authenticate user middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      })
    }

    // Get user from database
    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    // Attach user to request
    req.user = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
    }

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    })
  }
}
