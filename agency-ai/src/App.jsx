

import React, { useState, useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import Services from "./components/Services";
import OurWork from "./components/OurWork";
import Teams from "./components/Teams";
import ContactUs from "./components/ContactUs";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { Login, Signup } from "./components/auth";
import { supabase } from "./components/auth/supabaseClient";
import assets from "./assets/assets";


// ProtectedRoute component

// ProtectedRoute component (always checks token before rendering)
function ProtectedRoute({ children }) {
  const [checking, setChecking] = React.useState(true);
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    let waited = 0;
    const interval = setInterval(() => {
      const t = localStorage.getItem("token");
      setToken(t);
      waited += 500;
      if (t || waited >= 5000) {
        setChecking(false);
        clearInterval(interval);
      }
    }, 500);
    // Listen for token changes (e.g., after Google login)
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  if (checking) {
    // Optionally show a loading spinner here
    return null;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}


const App = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [user, setUser] = useState(null);

  // Auth state management
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user_name', session.user.user_metadata?.name || session.user.email || 'User');
        localStorage.setItem('user_image', session.user.user_metadata?.avatar_url || assets.profile_icon);
        window.dispatchEvent(new Event('storage'));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_image');
        window.dispatchEvent(new Event('storage'));
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setUser(session.user);
      }
    });

    // Check for existing session on app load
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setUser(data.session.user);
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user_name', data.session.user.user_metadata?.name || data.session.user.email || 'User');
        localStorage.setItem('user_image', data.session.user.user_metadata?.avatar_url || assets.profile_icon);
        window.dispatchEvent(new Event('storage'));
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="dark:bg-black relative">
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar theme={theme} setTheme={setTheme} />
                  <Hero />
                  <TrustedBy />
                  <Services />
                  <OurWork />
                  <Teams />
                  <ContactUs />
                  <Footer theme={theme} />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

