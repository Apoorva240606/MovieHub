import { useState, useEffect } from "react";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { voteMovie } from "../api";

export default function VoteButtons({ movie, initialVotes }) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(movie.user_vote || 0); // 1, -1, or 0

  const handleVote = async (e, type) => {
    e.stopPropagation();
    if (!movie) return;

    try {
      const newVoteCount = await voteMovie(movie.id, type);
      setVotes(newVoteCount.vote_count);

      // Toggle user vote locally
      if (userVote === type) {
        setUserVote(0); // removing the vote
      } else {
        setUserVote(type); // upvote or downvote
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired or unauthorized. Please log in again.");
        window.location.href = "/login";
      }
    }
  };

  return (
<div className="flex items-center space-x-2 mt-4">
  <button
    onClick={(e) => handleVote(e, 1)}
    className="p-1 rounded hover:bg-white/10"
  >
    <HandThumbUpIcon
      className={`w-5 h-5 ${
        userVote === 1 ? "text-blue-500" : "text-white"
      }`}
    />
  </button>

  <span className="text-gray-400 text-sm">{votes}</span>

  <button
    onClick={(e) => handleVote(e, -1)}
    className="p-1 rounded hover:bg-white/10"
  >
    <HandThumbDownIcon
      className={`w-5 h-5 ${
        userVote === -1 ? "text-blue-500" : "text-white"
      }`}
    />
  </button>
</div>


  );
}
