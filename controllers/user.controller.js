const { User } = require("../models/index")
const { Op } = require("sequelize")

// Get user profile
exports.getUserProfile = async (req, res, next) => {
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

// Update user profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, address, bio } = req.body

    // Update user
    await User.update(
      {
        name,
        email,
        address,
        bio,
        updatedAt: new Date(),
      },
      { where: { id: req.user.id } },
    )

    // Get updated user
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    })

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    next(error)
  }
}

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    user.updatedAt = new Date()
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Get user settings
exports.getUserSettings = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["settings"],
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      settings: user.settings,
    })
  } catch (error) {
    next(error)
  }
}

// Update user settings
exports.updateUserSettings = async (req, res, next) => {
  try {
    const { settings } = req.body

    // Update settings
    await User.update(
      {
        settings,
        updatedAt: new Date(),
      },
      { where: { id: req.user.id } },
    )

    // Get updated settings
    const user = await User.findByPk(req.user.id, {
      attributes: ["settings"],
    })

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: user.settings,
    })
  } catch (error) {
    next(error)
  }
}

// Get user by phone number
exports.getUserByPhoneNumber = async (req, res, next) => {
  try {
    const { phoneNumber } = req.params

    // Find user
    const user = await User.findOne({
      where: { phoneNumber },
      attributes: ["phoneNumber", "name", "status", "lastSeen"],
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

// Search users
exports.searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query

    // Search users by phone number or name
    const users = await User.findAll({
      where: {
        [Op.or]: [{ phoneNumber: { [Op.like]: `%${query}%` } }, { name: { [Op.like]: `%${query}%` } }],
      },
      attributes: ["phoneNumber", "name", "status", "lastSeen"],
    })

    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    next(error)
  }
}
