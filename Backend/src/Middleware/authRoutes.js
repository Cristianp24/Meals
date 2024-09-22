const jwt = require('jsonwebtoken');

// Middleware combinado para autenticación JWT o Passport
const combinedAuth = (req, res, next) => {
  const token = req.headers['authorization'];

  // Si existe el token, verificamos JWT
  if (token) {
    try {
      const decoded = jwt.verify(token.split(' ')[1], 'secret'); // Asegúrate de usar tu clave secreta aquí
      req.user = decoded; // Almacenar los datos del usuario en la solicitud
      return next(); // Pasar al siguiente middleware o controlador
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  }

  // Si no hay token, revisamos si hay una sesión con Passport
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // Si hay sesión Passport, pasar al siguiente middleware o controlador
  }

  // Si no hay autenticación de ninguna forma, devolver 401
  return res.status(401).json({ message: 'Unauthorized access.' });
};

module.exports = combinedAuth;
