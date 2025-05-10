// Create a script to test database connection
const { sequelize, testConnection } = require("../config/database")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const testDatabaseConnection = async () => {
  try {
    console.log("Testing database connection...")
    console.log("Database config:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      // Password hidden for security
    })

    const connected = await testConnection()

    if (connected) {
      console.log("✅ Database connection successful!")

      // Test query
      try {
        const [results] = await sequelize.query("SHOW TABLES;")
        console.log("Tables in database:", results)
      } catch (queryError) {
        console.error("Query error:", queryError)
      }
    } else {
      console.error("❌ Database connection failed!")
    }

    process.exit(connected ? 0 : 1)
  } catch (error) {
    console.error("Error testing database connection:", error)
    process.exit(1)
  }
}

testDatabaseConnection()
