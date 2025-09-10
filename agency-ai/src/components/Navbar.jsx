import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import ThemeToggleBtn from './ThemeToggleBtn'
import { motion } from "motion/react"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
const Navbar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className={`flex justify-between items-center z-20 backdrop-blur-xl font-medium transition-all duration-300
    ${scrolled
      ? 'shadow-lg rounded-full py-[10px] px-6 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 max-w-4xl mx-auto w-full sticky top-6'
      : 'w-full py-4 px-8 sm:px-12 lg:px-20 sticky top-0'
    }`}
>

      {/* Logo */}
      <img
        src={theme === 'dark' ? assets.logo_dark : assets.logo}
        alt=""
        className={`transition-all duration-300 
          ${scrolled ? 'w-16 sm:w-20' : 'w-28 sm:w-32'}
        `}
      />

      {/* Nav Links */}
      <div
        className={`text-gray-700 dark:text-white sm:text-base 
          ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-60 max-sm:pl-10'} 
          max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-primary max-sm:text-white max-sm:pt-20 
          flex sm:items-center sm:justify-between gap-6 transition-all 
          ${scrolled ? 'sm:text-sm' : 'sm:text-base'}
        `}
      >
        <img
          src={assets.close_icon}
          alt=""
          className="w-5 absolute right-4 top-4 sm:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
        <a onClick={() => setSidebarOpen(false)} href="#" className="sm:hover:border-b">Home</a>
        <a onClick={() => setSidebarOpen(false)} href="#services" className="sm:hover:border-b">Services</a>
        <a onClick={() => setSidebarOpen(false)} href="#our-work" className="sm:hover:border-b">Our Work</a>
        <a onClick={() => setSidebarOpen(false)} href="#contact-us" className="sm:hover:border-b">Contact Us</a>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4 sm:gap-8" style={{ position: 'relative' }}>
        <ThemeToggleBtn theme={theme} setTheme={setTheme} />
        <img
          src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon}
          alt=""
          onClick={() => setSidebarOpen(true)}
          className="w-8 sm:hidden cursor-pointer"
        />
        {/* Profile image with hover logout */}
        <div style={{ marginLeft: '24px', marginTop: '6px' }}>
          <ProfileMenu />
        </div>
      </div>
    </motion.div>
  )
}

// ProfileMenu component
function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("user_name") || "Profile");
  const [userImage, setUserImage] = useState(localStorage.getItem("user_image") || assets.profile_icon);

  useEffect(() => {
    const updateUserInfo = () => {
      setUserName(localStorage.getItem("user_name") || "Profile");
      setUserImage(localStorage.getItem("user_image") || assets.profile_icon);
    };
    window.addEventListener("storage", updateUserInfo);
    return () => window.removeEventListener("storage", updateUserInfo);
  }, []);

  const handleLogout = async () => {
    // Sign out from Supabase
    if (window.supabase && window.supabase.auth) {
      await window.supabase.auth.signOut();
    } else {
      try {
        const { supabase } = require('./auth/supabaseClient');
        await supabase.auth.signOut();
      } catch (e) {
        // fallback: ignore if supabase not available
      }
    }
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="relative">
      
      <button
        className="focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open profile menu"
      >
        <img
          src={userImage}
          alt="Profile"
          className="w-12 h-12 rounded-full cursor-pointer border-2 border-primary shadow-lg hover:scale-105 transition duration-150"
        />
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-3 z-20 flex flex-col items-center animate-fade-in">
          <div className="w-12 h-12 mb-2">
            <img
              src={userImage}
              alt="Profile"
              className="w-full h-full  rounded-full border border-gray-300 dark:border-gray-700 object-cover"
            />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight" style={{fontFamily: 'Inter, Segoe UI, Arial, sans-serif'}}>{userName}</span>
          <InteractiveHoverButton
          onClick={handleLogout}
          >
          
            Logout
            </InteractiveHoverButton>
          
        </div>
      )}
    </div>
  );
}

export default Navbar;

