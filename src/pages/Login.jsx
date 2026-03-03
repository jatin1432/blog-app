import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function Login({ closeModal, setUser }) {
  const modalRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClick = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) closeModal();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeModal]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const url = isRegister
        ? "https://blog-app.infinityfreeapp.com/api/register"
        : "https://blog-app.infinityfreeapp.com/api/login";

      const payload = isRegister
        ? { username: name, email, password }
        : { email, password };

      const { data } = await axios.post(url, payload, { withCredentials: true, headers: { "Content-Type": "application/json" } });

      if (data.status === "success") {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(isRegister ? "Registered successfully!" : "Logged in successfully!");
        closeModal();
      } else toast.error(data.message || "Authentication failed");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96 relative space-y-4">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 
        hover:text-gray-700 transition">✕</button>
        <h2 className="text-2xl font-bold text-center">{isRegister ? "Register" : "Login"}</h2>

        {isRegister && <input type="text" placeholder="Your Name" value={name} 
        onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-700 
        dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />}

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 
        rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} 
        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 
        outline-none" />

        <button onClick={handleSubmit} disabled={loading} className={`w-full py-2 rounded-lg text-white
           ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 transition"}`}>
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>

        <p className="text-sm text-center text-gray-500 dark:text-gray-300">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)} className="text-indigo-600 hover:underline cursor-pointer">
            {isRegister ? "Login here" : "Register here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
