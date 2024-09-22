const { Router } = require("express");
const { createMeal, getAllMeals, getMealById } = require("./mealsController");

const router = Router();


router.get("/", getAllMeals);
router.post("/", createMeal);
router.get("/:id", getMealById);

module.exports = router