const   { User } = require('../Other/dbConfig'); // Importa el modelo User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verify } = require("jsonwebtoken");
const { serialize } = require("cookie");
const nodemailer = require('nodemailer');


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
      role: 'user',
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
        { id: user.id, email: user.email, role: user.role },
        'secret', // Cambia esto por una clave secreta segura
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

async function suspendUser(req, res) {
  try {
    const userId = req.params.id;

    // Verificar si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Cambiar el estado del usuario
    if (user.status === "suspended") {
      // Si el usuario está suspendido, lo activamos
      user.status = "active";
    } else {
      // Si el usuario no está suspendido, lo suspendemos
      user.status = "suspended";
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error toggling user status" });
  }
}

const changeRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    // Verificar si los datos requeridos están presentes
    if (!userId || !newRole) {
      return res.status(400).json({ message: "userId y newRole son requeridos." });
    }

    // Validar que el rol sea uno de los permitidos (por ejemplo, 'user' o 'admin')
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Rol no válido." });
    }

    // Buscar el usuario en la base de datos y actualizar su rol
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.role = newRole;
    await user.save();

    // Responder con éxito
    res.status(200).json({ message: "Rol de usuario actualizado con éxito." });
  } catch (error) {
    console.error("Error al cambiar el rol del usuario:", error.message);
    res.status(500).json({ message: "Error al cambiar el rol del usuario." });
  }
};


const updateUserStatus = async (req, res) => {
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
}


const logout = (req, res) => {
  const userToken = req.headers.authorization.split('Bearer ')[1];
  
  if (!userToken) {
    return res.status(401).json({ error: "no token" });
  }
  try {
    verify(userToken, "secret");
    const serialized = serialize("userToken", null, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    // res.setHeader("Set-Cookie", serialized);
    res.status(200).json("Hasta pronto!");
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
};

const sendRecoveryEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Recovery',
    html: `<p>Click <a href="${resetUrl}" target="_blank">here</a> to reset your password. This link expires in 1 hour.</p>`
  };

  await transporter.sendMail(mailOptions);
};


const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  // Lógica para verificar si el usuario está registrado
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).send('User not found');
  }

  // Generar un token de restablecimiento de contraseña
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Construir la URL de restablecimiento
  const resetUrl = `http://localhost:5173/reset-password/${token}`;

  try {
    // Llama a la función para enviar el correo con el resetUrl
    await sendRecoveryEmail(email, resetUrl);
    return res.status(200).send('Recovery email sent');
  } catch (error) {
    return res.status(500).send('Password reset error: ' + error.message);
  }
};


const resetPassword = async (req, res) => {
  try {
    // Obtener y verificar el token desde la cabecera de autorización
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    // Decodificar el token para obtener el ID de usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Verificar que el usuario existe en la base de datos
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Obtener la nueva contraseña del cuerpo de la solicitud
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hashear la nueva contraseña y actualizarla en la base de datos
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    // Responder con un mensaje de éxito
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Error resetting password' });
  }
};

module.exports = { signIn, signUp, logout,  getAllUsers, suspendUser, changeRole, updateUserStatus, requestPasswordReset, resetPassword };