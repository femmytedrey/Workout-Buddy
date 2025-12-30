require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/userSchema");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? process.env.GOOGLE_CALLBACK_URL
          : "/api/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // if (!profile.emails || !profile.emails[0]) {
        //   return done(new Error("No email provided by Google"), null);
        // }

        const user = await User.findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
