const { Router } = require("express");
const { createMeal, getAllMeals, getMealById, getUserMeals } = require("./mealsController");
const combinedAuth = require('../Middleware/authRoutes');


const router = Router();


router.get("/", getAllMeals);
router.post("/",combinedAuth, createMeal);
router.get("/:id",getMealById);
router.get('/users/:id', getUserMeals);


module.exports = router