import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FiLock, FiMail } from "react-icons/fi";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Admin login failed");
      }

      const data = await response.json();
      login({ admin: data }, "admin");
      localStorage.setItem("user", JSON.stringify({ admin: data }));
      localStorage.setItem("userType", "admin");

      document.body.classList.add("bg-green-50");
      setTimeout(() => {
        document.body.classList.remove("bg-green-50");
        navigate("/admin/students");
      }, 800);
    } catch (error) {
      setError(error.message || "Admin login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 overflow-auto px-4 py-8 sm:py-0">
      <div className="bg-white border border-indigo-200 rounded-2xl shadow-2xl px-6 sm:px-10 py-10 sm:py-12 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 mb-6">
          🔐 Admin Panel
        </h2>

        {error && (
          <div className="text-red-700 bg-red-100 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute top-3.5 left-3 text-indigo-500" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute top-3.5 left-3 text-indigo-500" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-300 text-sm ${
              isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
