const { signupUser, loginUser, getUser, googleAuth, googleCallback } = require("../controllers/authController.js");
const { Router } = require("express");
const passport = require('passport');

const router = Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.get("/user/:id", getUser)
router.get("/google", googleAuth)
router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }), googleCallback)

module.exports = router;