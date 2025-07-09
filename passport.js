const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // ✅ Check if user already exists by email
        let user = await User.findOne({ email });

        if (!user) {
          // ✅ If not found, create new user with empty password
          user = new User({
            googleId: profile.id,
            name,
            email,
            password: "", // no password for Google users
          });
          await user.save();
        } else if (!user.googleId) {
          // ✅ Link Google ID if user exists but didn't sign up via Google before
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("❌ Passport Google error:", err.message);
        done(err, null);
      }
    }
  )
);

// ✅ Serialize user for session (not used with JWT)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});
