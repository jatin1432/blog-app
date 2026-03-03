import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function CreateEditBlog({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  // Fetch blog for editing
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost/blog-app/backend/api/posts/?id=${id}`)
        .then(res => {
          const blog = res.data;
          setTitle(blog.title);
          setContent(blog.content);
          setImage(blog.image || "");
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error("All fields are required");

    const payload = { title, content, image, author_id: user.id };

    if (id) {
      
      // Update existing blog
      axios.put(`http://localhost/blog-app/backend/api/posts/update.php/?id=${id}`, payload, { withCredentials: true })
        .then(()=> {
          toast.success("Blog updated successfully ✏️");
          navigate(`/blog/${id}`);
          
        })
        .catch(err => console.error(err));
    } else {
      // Create new blog
     axios.post(
        "http://localhost/blog-app/backend/api/posts/create.php",
        payload,
        { withCredentials: true }
      )
      .then(res => {
        if (res.data.status === "success") {
          toast.success("Blog created successfully 🚀");
          navigate(`/blog/${res.data.post.id}`);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Something went wrong");
      })
  }
}

  return (
    <div className="max-w-xl mx-auto p-10">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center mb-6">← Back to Blogs</Link>

      <h1 className="text-3xl font-bold">{id ? "Edit Blog" : "Create Blog"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input type="text" placeholder="Blog title" value={title} onChange={e => setTitle(e.target.value)} 
        className="w-full p-3 rounded-lg border dark:bg-gray-800" />
        <textarea placeholder="Blog content..." value={content} onChange={e => setContent(e.target.value)} 
        className="w-full p-3 rounded-lg border h-40 dark:bg-gray-800" />
        <input type="text" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} 
        className="w-full p-3 rounded-lg border dark:bg-gray-800" />
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
          {id ? "Update" : "Publish"}</button>
      </form>
    </div>
  );
}

export default CreateEditBlog;