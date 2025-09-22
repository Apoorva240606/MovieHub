import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMovies, getMoviesTrending, getMoviesWorst } from "../api.js";
import { useSearch } from "../context/SearchContext";
import MovieCard from "../components/MovieCard.jsx";

export default function Movies() {
  const { movies, setMovies } = useSearch();
  const [sortBy, setSortBy] = useState("latest"); // latest, trending, worst
  const location = useLocation();

  useEffect(() => {
    fetchMovies(sortBy);
  }, [location.pathname, sortBy]);

  const fetchMovies = async (type) => {
    try {
      let data;
      switch(type) {
        case "latest":
          data = await getMovies();
          break;
        case "trending":
          data = await getMoviesTrending();
          break;
        case "worst":
          data = await getMoviesWorst();
          break;
        default:
          data = await getMovies();
      }
      setMovies(data);
    } catch(err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Sorting Buttons */}
      <div className="flex space-x-4 mb-6">
        {["latest", "trending", "worst"].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              sortBy === type ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setSortBy(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {!movies || movies.length === 0 ? (
        <div>No Results</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} fetchMovies={fetchMovies}  />
          ))}
        </div>
      )}
    </div>
  );
}
