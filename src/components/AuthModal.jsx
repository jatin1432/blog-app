import { useState } from "react";

function AuthModal({ setShowAuth, isLoginMode, setIsLoginMode, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return alert("Fill all fields");

    if (isLoginMode) {
      const savedUser = JSON.parse(localStorage.getItem("account"));
      if (
        savedUser &&
        savedUser.email === email &&
        savedUser.password === password
      ) {
        localStorage.setItem("user", JSON.stringify(savedUser));
        setUser(savedUser);
        setShowAuth(false);
      } else {
        alert("Invalid credentials");
      }
    } else {
      const newUser = { email, password };
      localStorage.setItem("account", JSON.stringify(newUser));
      alert("Signup successful! Please login.");
      setIsLoginMode(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-96 shadow-xl relative">
        <button
          onClick={() => setShowAuth(false)}
          className="absolute top-2 right-3"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            {isLoginMode ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-sm mt-4 text-center cursor-pointer text-indigo-600"
        >
          {isLoginMode
            ? "Don't have account? Sign Up"
            : "Already have account? Login"}
        </p>
      </div>
    </div>
  );
}

export default AuthModal;