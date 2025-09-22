import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createComment = asyncHandler(async (req, res) => {
  try {
    const { body } = req.body;
    const movieId = req.params.id;
    const result = await pool.query(
      `INSERT INTO comments (user_id, movie_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, body, created_at, user_id, movie_id`,
      [req.user.id, movieId, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

export const getComments = asyncHandler(async (req, res) => {
  try {
    const movieId = req.params.id;
    const result = await pool.query(
      `SELECT c.id, c.body, c.created_at, 
      c.user_id, u.name AS name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.movie_id = $1
      ORDER BY c.created_at ASC`,
      [movieId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

export const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if(req.user.role == "admin" ) {
      const result = await pool.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [id]
    );

     if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found or not authorized" });
    }

    res.json({ message: "Comment deleted successfully" });
    }
    else {
    const result = await pool.query(
      "DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found or not authorized" });
    }

    res.json({ message: "Comment deleted successfully" });}
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const editComment = asyncHandler(async (req, res) => {
  console.log(req.body.body, req.user.id)
  try {
    const { body } = req.body; // new comment text
    const { id } = req.params; // comment id

    if (!body || !body.trim()) {
      return res.status(400).json({ error: "Comment body cannot be empty" });
    }
    // Single query: only updates if comment belongs to this user
    
    const result = await pool.query(
      `UPDATE comments
      SET body = $1, created_at = NOW()
      WHERE id = $2 AND user_id = $3
      RETURNING id, body, created_at, user_id, movie_id`,
      [body, id, req.user.id]
    );
    console.log("hello")

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized or comment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
