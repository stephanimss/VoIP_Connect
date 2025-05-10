const { sequelize } = require("../config/database")
const { syncDatabase } = require("../models/index")

const initializeDatabase = async () => {
  try {
    console.log("Initializing database...")

    // Force sync all models (this will drop tables if they exist)
    await syncDatabase(true)

    console.log("Database initialized successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initializeDatabase()
