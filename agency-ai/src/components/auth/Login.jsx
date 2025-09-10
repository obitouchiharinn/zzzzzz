
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import { motion } from "motion/react";
import { supabase } from "./supabaseClient";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

const Login = () => {
  const navigate = useNavigate();

  // Immediate redirect if token exists (fixes Google OAuth reload issue)
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email + password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token || data.session?.access_token);
        const name = data.user?.user_metadata?.name || data.user?.email || email;
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_image", assets.profile_icon);
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // Google login via Supabase
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:5173/" },
    });
    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = session.user;
          localStorage.setItem("token", session.access_token);
          localStorage.setItem(
            "user_name",
            user.user_metadata?.name || user.email
          );
          localStorage.setItem(
            "user_image",
            user.user_metadata?.avatar_url || assets.profile_icon
          );
          window.dispatchEvent(new Event("storage"));
          navigate("/");
        }
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden text-gray-700 dark:text-white bg-gradient-to-br from-[#eaf0ff] via-[#eaf0ff] to-[#dbeafe] dark:from-[#181c2a] dark:via-[#181c2a] dark:to-[#232a44]">
      {/* GridPattern background */}
      <div className="absolute inset-0 h-full w-full overflow-hidden z-0">
        <AnimatedGridPattern />
      </div>

      {/* Glowing background */}
      <motion.img
        src={assets.bgImage1}
        alt="glow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute left-[-180px] top-[-120px] w-[500px] blur-2xl pointer-events-none select-none z-0"
      />
      <motion.img
        src={assets.bgImage2}
        alt="glow2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute right-[-200px] bottom-[-120px] w-[500px] blur-2xl pointer-events-none select-none z-0"
      />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 text-center"
        >
          Welcome Back
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/90 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-xl backdrop-blur-md w-full max-w-lg"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-base font-semibold text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4d8cea]"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label
                htmlFor="password"
                className="text-base font-semibold text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4d8cea]"
              />
            </div>
            <button className="w-full py-3 mt-5 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white rounded-full font-semibold shadow-lg hover:scale-[1.03] transition">
              Sign in
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-5 w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white px-4 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          <div className="text-center text-sm text-gray-500 dark:text-gray-300 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary font-medium">
              Sign up
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
