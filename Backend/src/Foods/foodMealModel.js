module.exports = (sequelize, DataTypes) => {
  const MealFood = sequelize.define('MealFood', {
 
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: false // No necesitamos timestamps en este modelo intermedio
  });
  
  return MealFood;
};
