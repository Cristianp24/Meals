const { Router } = require("express");
const { createMeal, getAllMeals, getMealById, getUserMeals, deleteMeal } = require("./mealsController");
const combinedAuth = require('../Middleware/authRoutes');


const router = Router();


router.get("/", getAllMeals);
router.post("/",combinedAuth, createMeal);
router.get("/:id",getMealById);
router.get('/users/:userId', getUserMeals);
router.delete("/:id", deleteMeal);

module.exports = router