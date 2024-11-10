const jwt = require('jsonwebtoken');

const combinedAuth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  // Extraer el token después de 'Bearer'
  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(tokenWithoutBearer, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded; // Aquí guardamos el `userId` que está en el token
    next();
  });
};



module.exports = combinedAuth;