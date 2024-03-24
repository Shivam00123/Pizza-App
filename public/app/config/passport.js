const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: "No user registered with this email",
          });
        }
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (!match) {
              return done(null, false, {
                message: "Invalid username or password",
              });
            }
            return done(null, user, { message: "Logged in successfully" });
          })
          .catch((err) => {
            return done(null, false, { message: "Oops! Something went wrong" });
          });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
module.exports = init;
