const   { User } = require('../Database/dbConfig'); // Importa el modelo User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    // Verificación de campos vacíos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hacer hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Guardar la contraseña hasheada
    });

    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // Verificación de campos vacíos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Buscar al usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Comparar la contraseña proporcionada con la hasheada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'yourSecretKey', // Cambia esto por una clave secreta segura
      { expiresIn: '1h' } // Duración del token (puedes cambiar el valor)
    );

    // Enviar la respuesta con el token
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
}


async function getAllUsers(req, res) {
  try {
    
    const users = await User.findAll();
    if (!users.length) {
      return res.status(404).json({ message: 'No users found.' });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
}



module.exports = { signIn, signUp, getAllUsers };