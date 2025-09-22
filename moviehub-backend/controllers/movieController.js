import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// Add a new movie
export const addMovie = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    const addedBy = req.user.id;

    const result = await pool.query(
      `INSERT INTO movies (title, description, added_by)
       VALUES ($1, $2, $3) RETURNING *`,
      [title, description, addedBy]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Get all movies (latest) with user's vote info
export const getMovies = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const result = await pool.query(
      `SELECT m.*, u.name AS added_by_name, v.vote_type AS user_vote
       FROM movies m
       JOIN users u ON m.added_by = u.id
       LEFT JOIN votes v 
         ON v.movie_id = m.id AND v.user_id = $1
       ORDER BY m.created_at DESC, m.vote_count DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trending movies (highest votes) with user's vote
export const getMoviesTrending = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const result = await pool.query(
      `SELECT m.*, u.name AS added_by_name, v.vote_type AS user_vote
       FROM movies m
       JOIN users u ON m.added_by = u.id
       LEFT JOIN votes v 
         ON v.movie_id = m.id AND v.user_id = $1
       ORDER BY m.vote_count DESC, m.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get worst movies (lowest votes) with user's vote
export const getMoviesWorst = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const result = await pool.query(
      `SELECT m.*, u.name AS added_by_name, v.vote_type AS user_vote
       FROM movies m
       JOIN users u ON m.added_by = u.id
       LEFT JOIN votes v 
         ON v.movie_id = m.id AND v.user_id = $1
       ORDER BY m.vote_count ASC, m.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single movie by ID with user's vote
export const getMovieById = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { id } = req.params;
    const result = await pool.query(
      `SELECT m.*, u.name AS added_by_name, v.vote_type AS user_vote
       FROM movies m
       JOIN users u ON m.added_by = u.id
       LEFT JOIN votes v 
         ON v.movie_id = m.id AND v.user_id = $1
       WHERE m.id = $2`,
      [userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search movies by title/description with user's vote
export const searchMovies = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { q } = req.query;
    const result = await pool.query(
      `SELECT m.*, u.name AS added_by_name, v.vote_type AS user_vote
       FROM movies m
       JOIN users u ON m.added_by = u.id
       LEFT JOIN votes v 
         ON v.movie_id = m.id AND v.user_id = $1
       WHERE LOWER(m.title) LIKE LOWER($2) OR LOWER(m.description) LIKE LOWER($2)
       ORDER BY m.created_at DESC, m.vote_count DESC`,
      [userId, `%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a movie (only admin or movie owner)
export const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
console.log(id, userId, role)
    // Check who added it
    const movie = await pool.query("SELECT added_by FROM movies WHERE id=$1", [id]);
    if (movie.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    console.log("hello")

    if (role !== "admin" && movie.rows[0].added_by !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this movie" });
    }
 console.log("hello2")
    await pool.query("DELETE FROM movies WHERE id=$1", [id]);
     console.log("hello3")
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
