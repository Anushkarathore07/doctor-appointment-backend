const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user =
          (await Patient.findOne({ email: profile.emails[0].value })) ||
          (await Doctor.findOne({ email: profile.emails[0].value }));

        if (!user) {
          // Default role: patient (You can change this logic)
          user = new Patient({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "google-auth",
          });

          await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return done(null, { token, role: user.role });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.token);
});

passport.deserializeUser((token, done) => {
  done(null, { token });
});
