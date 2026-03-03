import { Link } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function Navbar({ user, setUser, darkMode, setDarkMode, setShowLoginModal }) {
  return (
    <nav className="flex justify-between items-center px-6 py-4 backdrop-blur-xl bg-white/40 
    dark:bg-gray-900/40 border-b border-white/20 dark:border-gray-700 shadow-md transition-colors duration-300">
      <Link
        to="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        DevBlog
      </Link>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-all duration-300"
        >
          {darkMode ? <MdLightMode/> : <MdDarkMode />
}
        </button>

        {user ? (
          <>
            <Link
              to="/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all 
              duration-300 hover:scale-105"
            >
              Create
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                setUser(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all
               duration-300 hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all 
            duration-300 hover:scale-105"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;