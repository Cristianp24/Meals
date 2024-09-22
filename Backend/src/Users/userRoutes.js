const { Router } = require("express");
const { signIn, signUp, logout, getAllUsers } = require('./usersController');
const passport = require('passport');
const passportStrategy = require('../Database/passport');


const router = Router();




router.get("/", getAllUsers);
router.get("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", logout);


router.get('/auth/google',
 passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', 
 passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
          // Successful authentication, redirect home.
    res.redirect('/meals');
 });
router.get("/auth/logout", (req, res) => {
   req.logout(() => {
     res.redirect("/brands");
     });
  });


module.exports = router;