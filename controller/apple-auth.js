const AppleStrategy = require("passport-appleid").Strategy;
const passport=require("passport");
const User=require("../model/userModel")

module.exports.connectPassport = () => {
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        clientSecret: process.env.APPLE_CLIENT_SECRET,
        callbackURL:  process.env.APPLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        const user = await User.findOne({
            appleId: profile.id,
        });

        if (!user) {
          const newUser = await User.create({
            appleId: profile.id,
            name: profile.displayName,
            photo: profile.photos[0].value,
          });

          return done(null, newUser);
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};