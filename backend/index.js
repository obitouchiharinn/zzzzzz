require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  // Pass name as user metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  // Get user info
  let name = data.user?.user_metadata?.name || data.user?.email || email;
  res.json({
    token: data.session?.access_token,
    user: {
      name,
      email: data.user?.email || email
    }
  });
});

// Protected route example
app.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: error.message });
  res.json(data);
});

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) return res.status(401).json({ error: error.message });

    req.user = data.user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Auth check failed" });
  }
};





app.listen(4000, () => console.log('Backend running on port 4000'));