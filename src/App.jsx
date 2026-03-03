import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import CreateEditBlog from "./pages/CreateEditBlog";
import ProtectedRoute from "./components/ProtectedRoutes";
import Login from "./pages/Login";
import axios from "axios";
import { FaRegCopyright } from "react-icons/fa";


function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
 
    axios.get(`api/session.php`, { withCredentials: true })
      .then(res => {
        if (res.data.status === "success") setUser(res.data.user);
      })
      .catch(() => {})
      .finally(() => setSessionChecked(true));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (!sessionChecked) return <div className="text-center py-20 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar
        user={user}
        setUser={setUser}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setShowLoginModal={setShowLoginModal}
      />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/blog/:id" element={<BlogDetails user={user} />} />
        <Route path="/create" element={
          <ProtectedRoute user={user}>
            <CreateEditBlog user={user} />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute user={user}>
            <CreateEditBlog user={user} />
          </ProtectedRoute>
        } />
      </Routes>

      {showLoginModal && <Login setUser={setUser} closeModal={() => setShowLoginModal(false)} />}

        <footer>
          <div className="flex justify-center items-center px-8 py-6 backdrop-blur-xl bg-white/40 
              dark:bg-gray-900/40 border-b border-white/20 dark:border-gray-700 shadow-md">
            <FaRegCopyright />
             <p> 2026 DevBLog, Inc. All rights reserved.</p>
          </div>
        </footer>
    </div>


  );
}

export default App;
