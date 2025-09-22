import { useState } from "react";
import { searchMovies } from "../api.js";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";

export default function SearchBar() {
  const {  query, setQuery , setMovies } = useSearch();
  const navigate = useNavigate();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const results = await searchMovies(query);
      setMovies(results)
      navigate("/")
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="ml-4 flex">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-1 rounded-l-md border border-gray-600 bg-gray-700 text-white focus:outline-none"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-indigo-600 rounded-r-md hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}
