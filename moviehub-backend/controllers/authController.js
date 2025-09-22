import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Signup
export const signup = asyncHandler(async (req, res) => {
    console.log("signin", req.body); 
    
    try {
    const { name, email, password } = req.body;
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        console.log(existing.row[0])
    if (existing.rows.length > 0) return res.status(400).json({ message: "Email already exists" });
console.log("hello")
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, passwordHash, "user"]
    );
console.log("hello2")

    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Login
export const login = asyncHandler(async (req, res) => {
      console.log("login", req.body); 
      const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
console.log("hello3",user)
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    console.log("Password:", password);
    console.log("Hash from DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    console.log("isMatch:", isMatch);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    console.log(res)
})

// Logout (handled on client usually, but we can "blacklist" tokens if needed)
export const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out successfully (client should delete token)" });
})

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
