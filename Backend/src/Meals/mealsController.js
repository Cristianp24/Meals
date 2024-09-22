const { Meal, Food } = require('../Database/dbConfig');   

const createMeal = async (req, res) => {
  try {
    const { name, foodItems } = req.body;

    // Validar la solicitud
    if (!name || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ error: 'Invalid data provided' });
    }

    // Si la autenticación es mediante JWT, los datos del usuario estarán en `req.user` por el middleware
    const userId = req.user.id; // O req.user si viene de Passport
    
    // Variables para sumar los valores nutricionales
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalCalories = 0;

    // Iterar sobre los items de comida para calcular los totales
    for (const item of foodItems) {
      const { foodId, quantity } = item;
  
      // Buscar el alimento por ID
      const food = await Food.findByPk(foodId);
      if (!food) {
        return res.status(404).json({ error: `Food with id ${foodId} not found.` });
      }
    
      // Calcular los valores nutricionales basados en la cantidad
      totalProtein += food.protein * (quantity / 100);
      totalCarbohydrates += food.carbohydrates * (quantity / 100);
      totalFat += food.fat * (quantity / 100);
      totalFiber += food.fiber * (quantity / 100);
      totalCalories += food.calories * (quantity / 100);
    }

    // Crear la comida con los valores totales y asociar al usuario autenticado
    const meal = await Meal.create({
      name,
      totalProtein,
      totalCarbohydrates,
      totalFat,
      totalFiber,
      totalCalories,
      userId, // Asociar la comida al usuario autenticado
    });

    return res.status(201).json(meal);
  } catch (error) {
    console.error('Error creating meal:', error);
    return res.status(500).json({ error: 'Error creating meal' });
  }
};

module.exports = { createMeal };


  const getAllMeals = async (req, res) => {
    try {
      const meals = await Meal.findAll({
        include: [
          {
            model: Food,
            as: 'foods',
            through: {
              attributes: ['quantity']
            }
          }
        ]
      });
      res.status(200).json(meals);
    } catch (error) {
      console.error('Error al obtener las comidas:', error);
      res.status(500).json({ error: 'Error al obtener las comidas' });
    }
  };
  

  const getMealById = async (req, res) => {
    
    const { id } = req.params;
    
    try {
      const meal = await Meal.findByPk(id); // Asume que usas Sequelize
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }
      res.json(meal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  
  module.exports = { createMeal, getAllMeals, getMealById };
  