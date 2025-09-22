import { Link } from "react-router-dom";
import VoteButtons from "./VoteButtons";
import { deleteMovie } from "../api.js";

export default function MovieCard({ movie, fetchMovies }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(movie.id)
      await fetchMovies()
    } catch (err) {
      console.error(err)
      alert("Error deleting movie.")
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm shadow-sm rounded-lg p-4 flex flex-col justify-between border border-gray-700 hover:bg-gray-800/60 transition">
      <Link to={`/movies/${movie.id}`}>
        <h2 className="text-white font-bold mb-2">{movie.title}</h2>
        <p className="text-[#8ba2ad] mb-2">
          {movie.description.length > 100
            ? movie.description.substring(0, 100) + "..."
            : movie.description}
        </p>
        <p className="text-gray-400 text-sm mb-2">@{movie.added_by_name}</p>
      </Link>

      <div className="flex items-center justify-between mt-2">
        <VoteButtons movie={movie} initialVotes={movie.vote_count} />

        {/* Admin Delete Button */}
        {user?.role === "admin" && (
          <button
            onClick={handleDelete}
            className="ml-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
