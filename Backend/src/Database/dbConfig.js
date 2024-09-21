const { Sequelize } = require('sequelize');

// Instancia de Sequelize
const sequelize = new Sequelize('meals', 'postgres', 'olvidatela', {
  host: 'localhost',
  dialect: 'postgres' // Puede ser otro dialecto como 'postgres', 'sqlite', etc.
});

// Verificar la conexión con la base de datos


module.exports = {
  conn:sequelize 
};