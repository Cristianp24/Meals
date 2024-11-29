const { Router } = require("express");
const { createFood, getAllFoods,deleteFood, searchFoodByName, updateFood } = require("./foodController");


const router = Router();


router.get("/", getAllFoods);
router.get('/search', searchFoodByName);
router.post("/", createFood);
router.delete("/:id", deleteFood);
router.put('/:id', updateFood);



module.exports = router