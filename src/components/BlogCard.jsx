import { Link } from "react-router-dom";
import { FaCommentAlt } from "react-icons/fa";


function BlogCard({ blog, page}) {
  const commentCount = blog.comment_count ?? 0;
  const likeCount = blog.likes ?? 0;

  return (
    <Link to={`/blog/${blog.id}?page=${page}`}>
      <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl 
      transition-shadow duration-300 cursor-pointer">
        <img
          src={blog.image || "https://via.placeholder.com/400x200"}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />

        <div className="p-4 flex flex-col justify-between h-52">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {blog.title}
            </h2>

            <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              By <span className="font-semibold">{blog.author}</span> |{" "}
              {blog.created_at
                ? new Date(blog.created_at).toLocaleDateString()
                : "Unknown date"}
            </div>

            <div className="flex items-center gap-5 mt-2">
              <span className="text-pink-500 font-semibold">
                ❤️ {likeCount}
              </span>
              <span className="flex gap-1 items-center text-gray-400 dark:text-gray-300 ">
                 <FaCommentAlt className="w-5"/> {commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;



// UPdate auto fill while editing the existing blog        ------DONE-------
// show total comment count on the blogcard page           ------DONE-------
// create a single table for comments and likes            
// like button functionalities                             ------DONE-------