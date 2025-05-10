const jwt = require("jsonwebtoken")

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "voip-integration-secret-key"
// JWT expiration time
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

// Generate JWT token
exports.generateJWT = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

// Verify JWT token
exports.verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}
