import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import { motion } from "motion/react";
import { supabase } from "./supabaseClient";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { AuroraText } from "@/components/magicui/aurora-text";
import { HyperText } from "@/components/magicui/hyper-text";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.session && data.session.access_token) {
          localStorage.setItem("token", data.session.access_token);
          localStorage.setItem("user_name", name);
          localStorage.setItem("user_image", assets.profile_icon);
          window.dispatchEvent(new Event('storage'));
        }
        navigate("/");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleGoogleSignup = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:5173/" },
    });

    if (error) console.error("Google signup error:", error.message);
    else {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = session.user;
          localStorage.setItem("token", session.access_token);
          localStorage.setItem("user_name", user.user_metadata?.name || user.email);
          localStorage.setItem("user_image", user.user_metadata?.avatar_url || assets.profile_icon);
          window.dispatchEvent(new Event('storage'));
          navigate("/");
        }
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden text-gray-700 dark:text-white bg-gradient-to-br from-[#eaf0ff] via-[#eaf0ff] to-[#dbeafe] dark:from-[#181c2a] dark:via-[#181c2a] dark:to-[#232a44]">
      <div className="absolute inset-0 h-full w-full overflow-hidden z-0">
              <AnimatedGridPattern />
            </div>
      {/* Glowing background */}
      <motion.img src={assets.bgImage1} alt="" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 1.2 }} className="absolute left-[-180px] top-[-120px] w-[500px] blur-2xl pointer-events-none select-none z-0" />
      <motion.img src={assets.bgImage2} alt="" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ duration: 1.5 }} className="absolute right-[-200px] bottom-[-120px] w-[500px] blur-2xl pointer-events-none select-none z-0" />
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-0 px-0 py-0 min-h-[70vh] bg-transparent">
        {/* Left side: header */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-16">
          <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.25 }}
  viewport={{ once: true }}
  className="w-full flex flex-col items-start justify-center text-left"
>
  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-snug mb-2 max-w-lg">
    Create your account <br />
    and <AuroraText>start building</AuroraText> digital <AuroraText>experiences</AuroraText>.
  </h1>
</motion.div>

        </div>
        {/* Right side: form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-8 md:py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            viewport={{ once: true }}
            className="bg-white/90 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-xl backdrop-blur-md w-full"
          >
            <div className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white flex justify-center">
              <HyperText>Sign Up</HyperText>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-base font-semibold text-gray-700 dark:text-gray-200">Full Name</label>
                <input required id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4d8cea]" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="email" className="text-base font-semibold text-gray-700 dark:text-gray-200">Email</label>
                <input required id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4d8cea]" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="password" className="text-base font-semibold text-gray-700 dark:text-gray-200">Password</label>
                <input required id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4d8cea]" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="confirmPassword" className="text-base font-semibold text-gray-700 dark:text-gray-200">Confirm Password</label>
                <input required id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4d8cea]" />
              </div>
              <button className="w-full py-3 mt-4 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white rounded-full font-semibold shadow-lg hover:scale-[1.03] transition">
                Sign up
              </button>
            </form>

            <button onClick={handleGoogleSignup} className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white px-4 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google logo" className="w-5 h-5"/>
              Sign up with Google
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-300 mt-3">
              Already have an account? <a href="/login" className="text-primary font-medium">Login</a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
