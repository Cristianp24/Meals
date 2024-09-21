// models/meal.js
module.exports = (sequelize, DataTypes) => {
    const Meal = sequelize.define('Meal', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalProtein: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalCarbohydrates: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalFat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalFiber: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalCalories: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    });
  
    
  
    return Meal;
  };
  