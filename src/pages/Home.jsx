import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

function Home({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  const perPage = 5;

  // Fetch blogs whenever page or search changes
  useEffect(() => {
    fetchBlogs();
    setSearchParams({page})
  }, [page, search]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `http://blog-app.rf.gd/api/posts/index.php`,
        {
          params: {
            page,
            perPage,
            search
          }
        }
      );
    // console.log(res.data);

    setBlogs(res.data.posts ?? []);
    setTotalPages(res.data.pagination?.totalPages ?? 1);

    } catch (err) {
      console.log(err);
    }
  };

  // Reset to page 1 when search changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Latest Blogs
      </h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={search}
          onChange={handleSearch}
          className="w-full max-w-md p-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 
          focus:ring-indigo-500 outline-none"
        />
      </div>

      {blogs.length === 0 ? (
        <div className="text-center text-xl">No blogs found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} page={page}/>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
}

export default Home;
