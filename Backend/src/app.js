const express = require("express");
const router = require("./routes/index.js");
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const passportConfig = require('./Other/passportConfig.js');
const passport = require('passport');
require('dotenv').config();


require("./Other/dbConfig.js");

const server = express();


const myOwnMiddleware = (req, res, next) => {
    console.log("Middleware serverlied!!");
    next();
};

server.use(cookieParser());


server.use(cors({
  origin: 'http://localhost:5173', // Asegúrate de que coincida con tu URL de frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración básica de express
server.use(express.json());
server.use(morgan('dev'));
server.use(myOwnMiddleware);

// Configuración de la sesión
server.use(session({
    secret: 'secret', // Cambia esto a una clave secreta segura
    resave: false,
    saveUninitialized: true,
}));

server.use(passport.initialize());
server.use(passport.session());

// // Configuración de passport
passportConfig(passport);

server.use("/", router);



server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});




module.exports = server;