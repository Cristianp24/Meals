const { Router } = require("express");
const userRoutes = require("../Users/userRoutes");
const mealsRoutes = require("../Meals/mealsRoutes");
const foodRoutes = require("../Foods/foodRoutes");

const router = Router();


router.use("/users", userRoutes);

router.use("/foods",foodRoutes);

router.use("/meals", mealsRoutes);



module.exports = router;