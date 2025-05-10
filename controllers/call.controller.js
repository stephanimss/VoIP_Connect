const { Call, User } = require("../models/index")
const { Op } = require("sequelize")
const { initiateCall, answerCall, endCall } = require("../services/kamailio.service")

// Initiate a new call
exports.initiateCall = async (req, res, next) => {
  try {
    const { callee, callType } = req.body
    const caller = req.user.phoneNumber

    // Check if callee exists
    const calleeUser = await User.findOne({ where: { phoneNumber: callee } })
    if (!calleeUser) {
      return res.status(404).json({
        success: false,
        message: "Callee not found",
      })
    }

    // Initiate call via Kamailio
    const result = await initiateCall(caller, callee, callType)

    res.status(200).json({
      success: true,
      message: "Call initiated",
      callId: result.callId,
      sessionId: result.sessionId,
    })
  } catch (error) {
    next(error)
  }
}

// Answer a call
exports.answerCall = async (req, res, next) => {
  try {
    const { sessionId, withVideo } = req.body
    const phoneNumber = req.user.phoneNumber

    // Answer call
    const result = await answerCall(phoneNumber, sessionId, withVideo)

    res.status(200).json({
      success: true,
      message: "Call answered",
      callId: result.callId,
    })
  } catch (error) {
    next(error)
  }
}

// End a call
exports.endCall = async (req, res, next) => {
  try {
    const { sessionId } = req.body

    // End call
    const result = await endCall(sessionId)

    res.status(200).json({
      success: true,
      message: "Call ended",
      callId: result.callId,
    })
  } catch (error) {
    next(error)
  }
}

// Get call history
exports.getCallHistory = async (req, res, next) => {
  try {
    const phoneNumber = req.user.phoneNumber

    // Get calls where user is either caller or callee
    const calls = await Call.findAll({
      where: {
        [Op.or]: [{ caller: phoneNumber }, { callee: phoneNumber }],
      },
      order: [["startTime", "DESC"]],
    })

    // Format call data
    const formattedCalls = await Promise.all(
      calls.map(async (call) => {
        // Determine if user is caller or callee
        const isOutgoing = call.caller === phoneNumber
        const otherParty = isOutgoing ? call.callee : call.caller

        // Get other party's user info
        const otherUser = await User.findOne({
          where: { phoneNumber: otherParty },
          attributes: ["name"],
        })

        // Calculate duration if call was answered and ended
        let duration = null
        if (call.answeredAt && call.endTime) {
          duration = Math.round((new Date(call.endTime) - new Date(call.answeredAt)) / 1000) // in seconds
        }

        return {
          id: call.id,
          otherParty: {
            phoneNumber: otherParty,
            name: otherUser ? otherUser.name : otherParty,
          },
          callType: call.callType,
          direction: isOutgoing ? "outgoing" : "incoming",
          status: call.status,
          startTime: call.startTime,
          answeredAt: call.answeredAt,
          endTime: call.endTime,
          duration,
        }
      }),
    )

    res.status(200).json({
      success: true,
      calls: formattedCalls,
    })
  } catch (error) {
    next(error)
  }
}

// Get call details
exports.getCallDetails = async (req, res, next) => {
  try {
    const { callId } = req.params

    // Get call
    const call = await Call.findByPk(callId)
    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      })
    }

    // Check if user is part of the call
    const phoneNumber = req.user.phoneNumber
    if (call.caller !== phoneNumber && call.callee !== phoneNumber) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this call",
      })
    }

    // Get caller and callee info
    const callerUser = await User.findOne({
      where: { phoneNumber: call.caller },
      attributes: ["name"],
    })

    const calleeUser = await User.findOne({
      where: { phoneNumber: call.callee },
      attributes: ["name"],
    })

    // Calculate duration if call was answered and ended
    let duration = null
    if (call.answeredAt && call.endTime) {
      duration = Math.round((new Date(call.endTime) - new Date(call.answeredAt)) / 1000) // in seconds
    }

    res.status(200).json({
      success: true,
      call: {
        id: call.id,
        caller: {
          phoneNumber: call.caller,
          name: callerUser ? callerUser.name : call.caller,
        },
        callee: {
          phoneNumber: call.callee,
          name: calleeUser ? calleeUser.name : call.callee,
        },
        callType: call.callType,
        status: call.status,
        startTime: call.startTime,
        answeredAt: call.answeredAt,
        endTime: call.endTime,
        duration,
      },
    })
  } catch (error) {
    next(error)
  }
}
