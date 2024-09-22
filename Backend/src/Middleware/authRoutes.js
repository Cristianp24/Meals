const jwt = require('jsonwebtoken');

// Middleware combinado para autenticación JWT o Passport
const combinedAuth = (req, res, next) => {
  const token = req.headers['authorization'];

  // Verificación de JWT
  if (token) {
    try {
      const decoded = jwt.verify(token.split(' ')[1], 'secret');
      req.user = decoded; // Almacenar los datos del usuario
      return next(); // Pasar al siguiente middleware o controlador
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  }

  // Verificación con Passport
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // Si hay sesión Passport
  }

  return res.status(401).json({ message: 'Unauthorized access.' });
};

module.exports = combinedAuth;
