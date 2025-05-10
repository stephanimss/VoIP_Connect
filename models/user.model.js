const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")
const bcrypt = require("bcryptjs")

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("online", "offline", "away", "busy"),
      defaultValue: "offline",
    },
    presence: {
      type: DataTypes.ENUM("online", "offline", "away", "dnd"),
      defaultValue: "offline",
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        notifications: {
          incomingCalls: true,
          missedCalls: true,
          systemUpdates: false,
          vibration: true,
          sound: true,
        },
        appearance: {
          theme: "light",
          fontSize: "medium",
          language: "english",
        },
        privacy: {
          showStatus: true,
          readReceipts: true,
          callHistory: true,
          twoFactorAuth: false,
        },
        audio: {
          inputDevice: "default",
          outputDevice: "default",
          volume: 80,
          noiseReduction: true,
          echoCancellation: true,
        },
        video: {
          camera: "default",
          quality: "auto",
          backgroundBlur: false,
          mirrorVideo: true,
        },
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
        }
      },
    },
  },
)

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = User
