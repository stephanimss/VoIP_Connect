const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")

const Call = sequelize.define(
  "Call",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    caller: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    callee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    callType: {
      type: DataTypes.ENUM("voice", "video"),
      defaultValue: "voice",
    },
    status: {
      type: DataTypes.ENUM("calling", "ringing", "in-progress", "ended", "missed", "failed"),
      defaultValue: "calling",
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual getter for calculating duration
Call.prototype.getCallDuration = function () {
  if (this.answeredAt && this.endTime) {
    return Math.round((new Date(this.endTime) - new Date(this.answeredAt)) / 1000) // in seconds
  }
  return 0
}

module.exports = Call
