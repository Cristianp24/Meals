
module.exports = (sequelize, DataTypes) => {
    const Food = sequelize.define('Food', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      protein: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      carbohydrates: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      fat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      fiber: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      calories: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quanty: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    });
  
  
    return Food;
  };
  