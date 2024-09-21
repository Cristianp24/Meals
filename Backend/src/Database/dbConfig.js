const { Sequelize } = require('sequelize');
const UserModel = require('../Users/userModel');
 const  FoodModel = require('../Foods/Food'); 
const  MealModel = require('../Meals/mealsModel'); 
const MealFoodModel  = require('../Foods/foodMealModel');  
// Instancia de Sequelize
const sequelize = new Sequelize('meals', 'postgres', 'olvidatela', {
  host: 'localhost',
  dialect: 'postgres' // Puede ser otro dialecto como 'postgres', 'sqlite', etc.
});

// Inicializar los modelos
const Food = FoodModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);
const Meal = MealModel(sequelize, Sequelize.DataTypes);
const MealFood = MealFoodModel(sequelize, Sequelize.DataTypes);

// // Definir relaciones
User.hasMany(Meal, { foreignKey: 'userId', as: 'meals' });
Meal.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Meal.belongsToMany(Food, { through: MealFood, as: 'foods' });
Food.belongsToMany(Meal, { through: MealFood, as: 'meals' });


// Exportar los modelos y la conexión
module.exports = {
    User,
  Meal,
   Food,
   MealFood, // No olvides exportar el modelo intermedio
  conn: sequelize
};