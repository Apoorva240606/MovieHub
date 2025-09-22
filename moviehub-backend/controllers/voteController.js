import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const vote = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: movieId } = req.params;
    const { vote_type } = req.body; // 1 = upvote, -1 = downvote

    // Check if the user has already voted
    const existing = await pool.query(
      `SELECT vote_type FROM votes WHERE user_id = $1 AND movie_id = $2`,
      [userId, movieId]
    );

    if (existing.rows.length > 0) {
      const currentVote = existing.rows[0].vote_type;

      if (currentVote === vote_type) {
        // Remove vote
        await pool.query(
          `DELETE FROM votes WHERE user_id = $1 AND movie_id = $2`,
          [userId, movieId]
        );
      } else {
        // Update vote
        await pool.query(
          `UPDATE votes SET vote_type = $1 WHERE user_id = $2 AND movie_id = $3`,
          [vote_type, userId, movieId]
        );
      }
    } else {
      // Insert new vote
      await pool.query(
        `INSERT INTO votes (user_id, movie_id, vote_type) VALUES ($1, $2, $3)`,
        [userId, movieId, vote_type]
      );
    }

    // Get the updated total vote count for this movie
    const result = await pool.query(
      `SELECT COALESCE(SUM(vote_type), 0) AS vote_count
       FROM votes
       WHERE movie_id = $1`,
      [movieId]
    );

    const voteCount = parseInt(result.rows[0].vote_count, 10);

    // Update the vote_count in movies table
    await pool.query(
      `UPDATE movies SET vote_count = $1 WHERE id = $2`,
      [voteCount, movieId]
    );

    res.json({ vote_count: voteCount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while voting" });
  }
});
