const { Food } = require('../Other/dbConfig');
const { Op } = require('sequelize');

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

  const searchFoodByName = async (req, res) => {
    const { name } = req.query;
  
    if (!name) {
      return res.status(400).json({ error: 'El parámetro "name" es requerido' });
    }
  
    try {
      // Realiza una búsqueda insensible a mayúsculas y minúsculas y parcial
      const foods = await Food.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%` // PostgreSQL permite búsquedas insensibles a mayúsculas con iLike
          }
        }
      });
  
      if (foods.length === 0) {
        return res.status(404).json({ message: 'No se encontraron alimentos con ese nombre' });
      }
  
      res.json(foods);
    } catch (error) {
      console.error('Error al buscar alimentos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  module.exports = {
    createFood,
    getAllFoods,
    deleteFood,
    searchFoodByName
  };