const { Router } = require("express");
const { signIn, signUp, logout, getAllUsers } = require('./usersController');
// const passport = require('passport');
// const passportStrategy = require('../Database/passportConfig');


const router = Router();




router.get("/", getAllUsers);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", logout);


module.exports = router;