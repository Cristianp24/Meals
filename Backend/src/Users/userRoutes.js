const { Router } = require("express");
const { signIn, signUp, logout, getAllUsers, suspendUser, changeRole, requestPasswordReset, resetPassword } = require('./usersController');
const passport = require('passport');
require('../Other/passportConfig');
const jwt = require('jsonwebtoken');

const { User } = require('../Other/dbConfig');


const router = Router();




router.get("/", getAllUsers);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", logout);
router.put("/:id/suspend", suspendUser);
router.put('/change-role', changeRole);

router.put('/status', async (req, res) => {
  const { userId, status } = req.body;

  try {
    // Verifica si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Actualiza el estado del usuario
    user.status = status;
    await user.save();

    res.status(200).send({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      const userId = req.user.id || req.user.sub; // Usar id o sub
      const token = jwt.sign(
        { id: userId, email: req.user.email },
        'secret', 
        { expiresIn: '1h' } 
      );
  
      res.redirect(`http://localhost:5173/create-meal#${token}`);
    }
  );


router.post('/request-password-reset', requestPasswordReset);

// Ruta para restablecer la contraseña con el token de recuperación
router.post('/reset-password/:token', resetPassword);
  

  

module.exports = router;