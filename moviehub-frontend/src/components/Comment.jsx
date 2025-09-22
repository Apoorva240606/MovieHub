export default function Comment({ comment }) {
  return (
    <div className="border-b py-2">
      <p className="text-gray-800">{comment.body}</p>
      <p className="text-gray-500 text-sm">By {comment.user_name} on {new Date(comment.created_at).toLocaleString()}</p>
    </div>
  );
}
