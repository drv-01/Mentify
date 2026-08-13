const prisma = require("../db/prisma.js");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { hashPassword, verifyPassword } = require("../Utils/bcryptPassword.js");
const { generateToken } = require("../Utils/token.js");
const { getBackendUrl, getFrontendUrl } = require('../config/runtime');
const normalizeEmail = (email) => email.trim().toLowerCase();
const signupUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name?.trim() || !email?.trim() || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  const normalizedEmail = normalizeEmail(email);
  try {
    const existingUser = await prisma.Users.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.Users.create({
      data: { name: name.trim(), email: normalizedEmail, password: hashedPassword },
    });

    const tokens = generateToken(newUser.id);
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

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: "Email and password required!" });
  }

  try {
    const user = await prisma.Users.findUnique({ where: { email: normalizeEmail(email) } });
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

const testGoogleConfig = async (req, res) => {
  try {
    const backendUrl = getBackendUrl();
    const frontendUrl = getFrontendUrl();
      
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

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const response = { message: 'If an account exists for that email, a reset link has been sent.' };

  if (!email?.trim()) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.JWT_SECRET) {
      console.error('Password reset email is not configured');
      return res.status(503).json({ message: 'Password reset is temporarily unavailable.' });
    }

    const user = await prisma.Users.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user) return res.status(200).json(response);

    const token = jwt.sign({ userId: user.id, purpose: 'password-reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `${getFrontendUrl()}/forgot-password?token=${encodeURIComponent(token)}`;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset your Mentify password',
      text: `Reset your password within 15 minutes: ${resetUrl}`,
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error('Password reset request error:', err.message);
    return res.status(500).json({ message: 'Unable to request a password reset.' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'A valid reset token and a password of at least 8 characters are required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.purpose !== 'password-reset' || !payload.userId) {
      return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
    }

    await prisma.Users.update({
      where: { id: payload.userId },
      data: { password: await hashPassword(newPassword) },
    });
    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
    }
    console.error('Password reset error:', err.message);
    return res.status(500).json({ message: 'Unable to reset password.' });
  }
};

module.exports = { signupUser, loginUser, getUser, requestPasswordReset, resetPassword, testGoogleConfig };
