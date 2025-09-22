import express from "express";
import { signup, login } from "../controllers/authController.js";import { addMovie, getMovies, getMovieById, deleteMovie, searchMovies, getMoviesTrending, getMoviesWorst } from "../controllers/movieController.js";
import { vote } from "../controllers/voteController.js";
import { createComment, getComments, deleteComment, editComment } from "../controllers/commentController.js";
import { authenticate, optionalAuthenticate } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);

// Movies
router.get("/movies",optionalAuthenticate,  getMovies);
router.get("/movies/search",optionalAuthenticate, searchMovies);
router.post("/movies", authenticate, addMovie);
router.get("/movies/trending", optionalAuthenticate, getMoviesTrending);
router.get("/movies/worst", optionalAuthenticate, getMoviesWorst);
router.get("/movies/:id", optionalAuthenticate, getMovieById);
router.delete("/movies/:id", authenticate, isAdmin, deleteMovie);

// Votes
router.post("/movies/:id/vote", authenticate, vote);

// Comments
router.post("/movies/:id/comments", authenticate, createComment);
router.get("/movies/:id/comments", optionalAuthenticate, getComments);
router.delete("/comments/:id", authenticate, deleteComment);
router.post("/editcomments/:id", authenticate, editComment);

router.delete("/admin/movies/:id", isAdmin, deleteMovie);

export default router;
