const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('./dbConfig'); // Importa tu modelo User

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/users/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });
    
        if (!user) {
          // Si no existe, crea un nuevo usuario
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: 'google',
          });
        }
    
        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id); // Serializa el usuario con su ID
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user); // Deserializa el usuario
    } catch (error) {
      done(error, null);
    }
  });
};
