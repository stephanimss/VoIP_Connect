const User = require("../models/user.model")
const { generateJWT } = require("../utils/auth.utils")
const { registerUser } = require("../services/kamailio.service")
const { connectUser } = require("../services/xmpp.service")

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { phoneNumber, password, name, email } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phoneNumber } })
    if (existingUser) {
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

    // Register user with Kamailio
    await registerUser(phoneNumber, password, name || phoneNumber)

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
    next(error)
  }
}

// Login user
exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body

    // Check if user exists
    const user = await User.findOne({ where: { phoneNumber } })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Connect user to XMPP
    const xmppResult = await connectUser(phoneNumber, password)

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
    next(error)
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
