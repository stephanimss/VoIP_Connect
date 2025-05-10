const User = require("../models/user.model")
const { generateJWT } = require("../utils/auth.utils")
const { registerUser } = require("../services/kamailio.service")
const { connectUser } = require("../services/xmpp.service")

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { phoneNumber, password, name, email } = req.body

    console.log("Registration attempt:", { phoneNumber, name, email })

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phoneNumber } })
    if (existingUser) {
      console.log("User already exists:", phoneNumber)
      return res.status(400).json({
        success: false,
        message: "User with this phone number already exists",
      })
    }

    // Create user in database
    const user = await User.create({
      phoneNumber,
      password, // Password will be hashed by the model hook
      name,
      email,
    })

    console.log("User created successfully:", { id: user.id, phoneNumber })

    // Register user with Kamailio (wrapped in try/catch to prevent failure if Kamailio is not available)
    try {
      await registerUser(phoneNumber, password, name || phoneNumber)
      console.log("User registered with Kamailio")
    } catch (kamailioError) {
      console.error("Kamailio registration failed, but user created in database:", kamailioError)
      // Continue with user creation even if Kamailio registration fails
    }

    // Generate JWT token
    const token = generateJWT(user.id)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    })
  }
}

// Login user
exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body

    console.log("Login attempt:", { phoneNumber })

    // Check if user exists
    const user = await User.findOne({ where: { phoneNumber } })
    if (!user) {
      console.log("User not found:", phoneNumber)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      console.log("Invalid password for user:", phoneNumber)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    console.log("User authenticated successfully:", { id: user.id, phoneNumber })

    // Connect user to XMPP (wrapped in try/catch to prevent failure if XMPP is not available)
    let xmppResult = { jid: `${phoneNumber}@voip.local` }
    try {
      xmppResult = await connectUser(phoneNumber, password)
      console.log("User connected to XMPP:", xmppResult)
    } catch (xmppError) {
      console.error("XMPP connection failed, but login successful:", xmppError)
      // Continue with login even if XMPP connection fails
    }

    // Generate JWT token
    const token = generateJWT(user.id)

    // Update last login
    user.lastLogin = new Date()
    user.status = "online"
    await user.save()

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
      },
      xmpp: {
        jid: xmppResult.jid,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
}

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// Logout user
exports.logout = async (req, res, next) => {
  try {
    // Update user status
    await User.update(
      {
        status: "offline",
        lastSeen: new Date(),
      },
      { where: { id: req.user.id } },
    )

    res.status(200).json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    next(error)
  }
}
