const prisma = require("../db/prisma.js");
const { hashPassword, verifyPassword } = require("../Utils/bcryptPassword.js");
const { generateToken } = require("../Utils/token.js");
const signupUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }

  try {
    const existingUser = await prisma.Users.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.Users.create({
      data: { name, email, password: hashedPassword },
    });

    const tokens = generateToken(newUser.id);
    res.cookie('token', tokens.accessTokens, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 24 * 60 * 60 * 1000 });
    
    const userToReturn = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      bio: newUser.bio,
      phone: newUser.phone,
      location: newUser.location
    };
    
    return res.status(201).json({ 
      message: "User created successfully!", 
      token: tokens.accessTokens,
      user: userToReturn
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server Error!" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required!" });
  }

  try {
    const user = await prisma.Users.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    if (!user.password) {
      return res.status(401).json({ message: "This account was created with Google. Please use Google Sign-in." });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const tokens = generateToken(user.id);
    res.cookie('token', tokens.accessTokens, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 24 * 60 * 60 * 1000 });
    
    const userToReturn = {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      location: user.location
    };

    return res.status(200).json({ 
      message: "Login successful!", 
      token: tokens.accessTokens, 
      user: userToReturn 
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server Error!", error: err.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.Users.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.status(200).json({ name: user.name, email: user.email });
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

const checkUserExists = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await prisma.Users.findFirst({ where: { email } });
    return res.status(200).json({ exists: !!user });
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

const testGoogleConfig = async (req, res) => {
  try {
    const backendUrl = process.env.RENDER || process.env.NODE_ENV === 'production' 
      ? 'https://mentify.onrender.com' 
      : 'http://localhost:8000';
    const frontendUrl = process.env.RENDER || process.env.NODE_ENV === 'production'
      ? 'https://mentifyapp.vercel.app'
      : 'http://localhost:5173';
      
    const config = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20),
      nodeEnv: process.env.NODE_ENV,
      renderEnv: process.env.RENDER,
      backendUrl,
      frontendUrl,
      redirectUri: `${backendUrl}/api/auth/google/callback`,
      authUrl: `${backendUrl}/api/auth/google`
    };
    return res.status(200).json(config);
  } catch (err) {
    console.error('Test config error:', err);
    return res.status(500).json({ message: "Server Error!", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required!" });
  }

  try {
    const user = await prisma.Users.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.Users.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

module.exports = { signupUser, loginUser, getUser, checkUserExists, resetPassword, testGoogleConfig };
