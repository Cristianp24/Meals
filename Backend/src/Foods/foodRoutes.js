const { Router } = require("express");
const { createFood, getAllFoods,deleteFood, searchFoodByName } = require("./foodController");


const router = Router();


router.get("/", getAllFoods);
router.get('/search', searchFoodByName);
router.post("/", createFood);
router.delete("/:id", deleteFood);



module.exports = router