// For Initialzing the express server - Connecting to server.ts further for running HTTP!
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require("./routes/authRouts.js")

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://mentifyapp.vercel.app'];


app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Basic GET route
app.get('/', (req, res) => {
  res.json({ message: 'Mentify Backend API is running!', status: 'OK' });
});

app.use("/api/auth/", authRoutes)

module.exports = app;