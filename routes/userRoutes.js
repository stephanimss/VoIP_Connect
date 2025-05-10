const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

// Dummy login route
router.post("/login", (req, res) => {
  const { username, password } = req.body
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ id: 1, username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
    return res.json({ token })
  }
  res.status(401).json({ message: "Invalid credentials" })
})

router.get("/", (req, res) => {
    res.json({ message: "User routes working!" });
});

module.exports = router
