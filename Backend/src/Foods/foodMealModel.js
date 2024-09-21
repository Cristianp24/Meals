module.exports = (sequelize, DataTypes) => {
  const MealFood = sequelize.define('MealFood', {
    mealId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: false // No necesitamos timestamps en este modelo intermedio
  });
  
  return MealFood;
};
