const { Router } = require("express");
const { signIn, signUp, logout, getAllUsers } = require('./usersController');
const passport = require('passport');
require('../Other/passportConfig');
const jwt = require('jsonwebtoken');


const router = Router();




router.get("/", getAllUsers);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", logout);


router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        'secret', 
        { expiresIn: '1h' } 
      );
      
      // Almacena el token en localStorage
      res.redirect(`http://localhost:5173/create-meal#${token}`);
    }
  );

module.exports = router;