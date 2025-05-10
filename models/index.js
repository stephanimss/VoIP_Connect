const { sequelize } = require("../config/database")
const User = require("./user.model")
const Call = require("./call.model")

// Define relationships here if needed
// For example:
// User.hasMany(Call, { foreignKey: 'userId', as: 'calls' });
// Call.belongsTo(User, { foreignKey: 'userId' });

// Sync all models with the database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force })
    console.log("Database synchronized successfully")
  } catch (error) {
    console.error("Error synchronizing database:", error)
  }
}

module.exports = {
  sequelize,
  User,
  Call,
  syncDatabase,
}
