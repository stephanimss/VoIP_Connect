// Create a script to test API endpoints with Postman-like functionality
const axios = require("axios")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const BASE_URL = `http://localhost:${process.env.PORT || 5001}`
let authToken = null

const testEndpoints = async () => {
  try {
    console.log(`Testing API endpoints at ${BASE_URL}`)

    // Test root endpoint
    console.log("\n1. Testing root endpoint (GET /)")
    const rootResponse = await axios.get(`${BASE_URL}/`)
    console.log("Status:", rootResponse.status)
    console.log("Response:", rootResponse.data)

    // Test database connection endpoint
    console.log("\n2. Testing database connection (GET /api/test-db)")
    try {
      const dbResponse = await axios.get(`${BASE_URL}/api/test-db`)
      console.log("Status:", dbResponse.status)
      console.log("Response:", dbResponse.data)
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
    }

    // Test user routes
    console.log("\n3. Testing user routes (GET /api/users)")
    try {
      const usersResponse = await axios.get(`${BASE_URL}/api/users`)
      console.log("Status:", usersResponse.status)
      console.log("Response:", usersResponse.data)
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
    }

    // Test login
    console.log("\n4. Testing login (POST /api/users/login)")
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
        username: "admin",
        password: "password",
      })
      console.log("Status:", loginResponse.status)
      console.log("Response:", loginResponse.data)

      if (loginResponse.data.token) {
        authToken = loginResponse.data.token
        console.log("Authentication token received!")
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
    }

    // Test registration
    console.log("\n5. Testing registration (POST /api/auth/register)")
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
        phoneNumber: "1234567890",
        password: "password123",
        name: "Test User",
        email: "test@example.com",
      })
      console.log("Status:", registerResponse.status)
      console.log("Response:", registerResponse.data)
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
    }

    console.log("\nAPI testing completed!")
  } catch (error) {
    console.error("Error testing endpoints:", error)
  }
}

testEndpoints()
