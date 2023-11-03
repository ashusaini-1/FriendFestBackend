const passport=require("passport");
const FacebookStrategy=require("passport-facebook").Strategy;
const User=require("../model/userModel")

module.exports.connectFacebook = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL:  process.env.FACEBOOK_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        const user = await User.findOne({
            facebookId: profile.id,
        });

        if (!user) {
          const newUser = await User.create({
            facebookId: profile.id,
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