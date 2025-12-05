// For Initialzing the express server - Connecting to server.ts further for running HTTP!
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRouts.js")
const moodRoutes = require("./routes/moodRoutes.js")
const mentorshipRoutes = require("./routes/mentorshipRoutes.js")
const fitnessRoutes = require("./routes/fitnessRoutes.js")
const dietRoutes = require("./routes/dietRoutes.js")
const taskRoutes = require("./routes/taskRoutes.js")
const chatRoutes = require("./routes/chatRoutes.js")
const activityRoutes = require("./routes/activityRoutes.js")
const profileRoutes = require("./routes/profileRoutes.js")

const app = express();

// const allowedOrigins = ['http://localhost:5173', 'https://mentifyapp.vercel.app'];


app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

// Basic GET route
app.get('/', (req, res) => {
  res.json({ message: 'Mentify Backend API is running!', status: 'OK' });
});

app.use("/api/auth/", authRoutes)
app.use("/api/mood", moodRoutes)
app.use("/api/mentorship", mentorshipRoutes)
app.use("/api/fitness", fitnessRoutes)
app.use("/api/diet", dietRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/profile", profileRoutes)

module.exports = app;