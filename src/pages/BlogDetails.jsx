import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";



function BlogDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const page = params.get("page") || 1;

  // Fetch Single Blog

  useEffect(() => {
    axios
      .get(`/api/posts/index.php?id=${id}`,  { withCredentials: true }  )
      .then((res) => {
        let postData = res.data;

        // If backend returns array instead of object
        if (Array.isArray(postData)) {
          postData = postData[0];
        }

        if (!postData) {
          setBlog(null);
          return;
        }

        setBlog({
          ...postData,
          likes: postData.likes ?? 0,
          comments: postData.comments ?? [],
            liked: postData.liked ?? false,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load blog");
      });
  }, [id]);

  // Loading State

  if (!blog || !blog.id) {
    return (
      <div className="p-10 text-center text-xl">
        Loading blog...
      </div>
    );
  }

  // Like Blog

const likeBlog = () => {
  if (!user) return toast.error("Please login first");
  if (!blog?.id) return;

  axios.post(
    `/api/posts/like.php?id=${blog.id}`,
    { user_id: user.id },
     { withCredentials: true }  
  )
    .then((res) => {
      const updatedPost = res.data;

      setBlog((prev) => ({
        ...prev,
        
        likes: updatedPost.likes,
        liked: updatedPost.liked,

      }));
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to update like");
    });
};

  // Delete Blog
const deleteBlog = async () => {
  if (!user) return;

  if (!window.confirm("Are you sure you want to delete this blog?")) return;

  try {
    await axios.delete(
      `/api/posts/delete.php`,
      {
        params: { id: blog.id },
        withCredentials: true
      }
    );

    toast.success("Blog deleted");
    navigate("/");

  } catch (err) {
    console.error(err);
    toast.error("Failed to delete blog");
  }
};


  // Comment Section Safety

  const comments = blog.comments ?? [];


  const addComment = () => {
  if (!user) return toast.error("Please login first");
  if (!comment.trim()) return toast.error("Comment cannot be empty");

  axios.post(
    `/api/posts/add.php`,
    {
      post_id: blog.id,
      user_id: user.id,
      text: comment,
    }
  )
    .then((res) => {
      setBlog((prev) => ({
        ...prev,
        comments: [...prev.comments, res.data],
      }));
      setComment("");
      toast.success("Comment added");
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to add comment");
    });
};

  return (
    <div className="max-w-3xl mx-auto p-10">
      <Link to={`/?page=${page}`} className="text-indigo-600 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mt-4">
        {blog.title}
      </h1>

      <div className="text-gray-500 dark:text-gray-300 my-2">
        By <strong>{blog.author}</strong> |{" "}
        {blog.created_at
          ? new Date(blog.created_at).toLocaleDateString()
          : ""}
      </div>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg my-4"
        />
      )}

      <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
        {blog.content}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
           onClick={likeBlog}
            className={`px-4 py-2 rounded-lg transition hover:scale-105 ${
            blog.liked
               ? "bg-pink-600 text-white"
               : "bg-gray-300 text-gray-800"
             }`}
        >
      {blog.liked ? "💖 Liked" : "🤍 Like"} ({blog.likes})
      </button>

        {user && user.id === blog.author_id && (
          <>
            <Link
              to={`/edit/${blog.id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Edit
            </Link>
            <button
              onClick={deleteBlog}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Comments */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">
          Comments ({comments.length})
        </h2>

        {comments.length === blog.comments && (
          <p className="text-gray-500 mt-3">
            No comments yet.
          </p>
        )}

        {comments.map((c, i) => (
          <div
            key={i}
            className="mt-3 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            <strong>{c.user}:</strong> {c.text}
          </div>
        ))}

        {user && (
          <div className="mt-6 flex gap-2 text-white">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 p-2 rounded-lg border dark:bg-gray-800"
            />
            <button
                onClick={addComment}
                className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
