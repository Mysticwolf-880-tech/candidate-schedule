
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();
const secretKey = "mySecretKey";

//Auth Login and Generate JWT Token and Cookies
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT * FROM login WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.name, role: user.role },
      secretKey,
      { expiresIn: "9h" }
    );

    res
      .cookie("token", token, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 9 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
      });
  });
});


//LogOut API
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router; 
