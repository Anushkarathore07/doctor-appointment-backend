const express = require("express");
const passport = require("passport");

const router = express.Router();

// Redirect to Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user || !req.user.token) {
      return res.status(400).json({ message: "Authentication failed" });
    }

    // Redirect based on role
    const { token, role } = req.user;
    if (role === "doctor") {
      res.redirect(`http://localhost:3000/doctor/dashboard?token=${token}`);
    } else {
      res.redirect(`http://localhost:3000/patient/dashboard?token=${token}`);
    }
  }
);

module.exports = router;
