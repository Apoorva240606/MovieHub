import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, voteMovie, getComments, addComment, deleteComment, editComment } from "../api.js";
import VoteButtons from "../components/VoteButtons.jsx";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMovie();
    fetchComments();
  }, []);

  const fetchMovie = async () => {
    const data = await getMovieById(id);
    setMovie(data);
  };

  const fetchComments = async () => {
    const data = await getComments(id);
    setComments(data);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(id, newComment);
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Error posting comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Error deleting comment.");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      await editComment(commentId, editingText);
      setEditingCommentId(null);
      setEditingText("");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Error editing comment.");
    }
  };

  if (!movie) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Movie Details */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-white">{movie.title}</h1>
        <p className="text-gray-400 font-semibold mb-2">{movie.description}</p>
        <p className="text-gray-500 text-sm mb-4">Added by: {movie.name}</p>
        <VoteButtons movie={movie} initialVotes={movie.vote_count} />
      </div>

      {/* Comments Section */}
      <div className="bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Comments</h2>

        {/* Add New Comment */}
        <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Post
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border-b border-gray-700 py-2 flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-300 text-xs">@{c.name}</p>
                {editingCommentId === c.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                    />
                    <button
                      onClick={() => handleEditComment(c.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingCommentId(null); setEditingText(""); }}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-1 pl-2">{c.body}</p>
                )}
              </div>

            {(user && c.user_id === user.id && editingCommentId !== c.id) || (user?.role=="admin") ? (
              <div className="flex gap-2 ml-2">
                {c.user_id === user.id && editingCommentId !== c.id && (
                  <button
                    onClick={() => { setEditingCommentId(c.id); setEditingText(c.body); }}
                    className="text-blue-400 hover:text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ) : null}

            </div>
          ))
        )}
      </div>
    </div>
  );
}
