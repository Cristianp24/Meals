const { Router } = require("express");
const { signIn, signUp, logout, getAllUsers } = require('./usersController');
const passport = require('passport');
const passportStrategy = require('../Database/passportConfig');


const router = Router();




router.get("/", getAllUsers);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", logout);


router.get('/auth/google',
 passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', 
 passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
          // Successful authentication, redirect.
    res.redirect('http://localhost:5173/create-meal');
 });
router.get("/auth/logout", (req, res) => {
   req.logout(() => {
     res.redirect("/home");
     });
  });


module.exports = router;