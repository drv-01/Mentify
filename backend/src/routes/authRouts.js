const { signupUser, loginUser, getUser, checkUserExists, resetPassword, testGoogleConfig } = require("../controllers/authController.js");
const { googleAuth, googleCallback } = require("../controllers/googleAuth.js");
const { Router } = require("express");

const router = Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.get("/user/:id", getUser)
router.get("/user-exists", checkUserExists)
router.post("/reset-password", resetPassword)
router.get("/test-google-config", testGoogleConfig)
router.get("/google", googleAuth)
router.get("/google/callback", googleCallback)

module.exports = router;