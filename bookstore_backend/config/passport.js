const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails?.[0]?.verified) {
          return done(null, false, { message: "Email not verified" });
        }
        const email = profile.emails[0].value;
        const normalizedEmail = email.toLowerCase()
        let user = await User.findOne({ email: normalizedEmail, isActive: true, });
        if (user && !user.isActive) {
          return done(null, false, { message: "Account disabled" });
        }
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: normalizedEmail,
            photo: profile.photos[0] ? profile.photos[0].value : undefined,
            role: "user", // DEFAULT
            provider: "google",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);
