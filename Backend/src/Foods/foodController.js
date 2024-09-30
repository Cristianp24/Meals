const { Food } = require('../Other/dbConfig');

const createFood = async (req, res) => {
    try {
      const { name, protein, carbohydrates, fat, fiber, calories, quanty,unit, imageUrl } = req.body;
  
      // Crea un nuevo registro en la base de datos
      const newFood = await Food.create({
        name,
        protein,
        carbohydrates,
        fat,
        fiber,
        calories,
        quanty,
        unit,
        imageUrl,  // Asigna la URL de la imagen al nuevo registro
      });
  
      res.status(201).json(newFood);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'No se pudo crear el alimento.' });
    }
  };

  const getAllFoods = async (req, res) => {
    try {
      const foods = await Food.findAll();
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los alimentos', error: error.message });
    }
  };
  
  const deleteFood = async (req, res) => {
    try {
      const foodId = req.params.id;
  
      // Verifica si el alimento existe
      const food = await Food.findByPk(foodId);
      if (!food) {
          return res.status(404).json({ message: 'Food not found.' });
      }
      // Elimina el alimento
      await food.destroy();
  
      res.status(200).json({ message: 'Food deleted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting food', error: error.message });
  }
  }
  
  module.exports = {
    createFood,
    getAllFoods,
    deleteFood
  };