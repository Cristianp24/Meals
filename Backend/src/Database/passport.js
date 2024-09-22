require("dotenv").config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");



passport.use(new GoogleStrategy({
 clientID: process.env.GOOGLE_CLIENT_ID,
 clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 callbackURL: "http://localhost:3000/users/auth/google/callback",
 scope: ["profile", "email"]
 },
 function(accessToken, refreshToken, profile, cb) {
 console.log(profile)
 return cb(null, profile);

 }
));


passport.serializeUser( (user, done) => {
 done(null, user)
})

passport.deserializeUser( (user, done) => {
 done(null, user)
})


module.exports = passport;