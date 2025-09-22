import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get top movies by score
export const getTopMovies = asyncHandler(async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.id, m.title, m.description, 
              COALESCE(SUM(v.vote_type), 0) AS score
       FROM movies m
       LEFT JOIN votes v ON m.id = v.movie_id
       GROUP BY m.id
       ORDER BY score DESC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// List all users
export const listUsers = asyncHandler(async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Promote user to admin
export const promoteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET role='admin' WHERE id=$1", [id]);
    res.json({ message: "User promoted to admin" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
