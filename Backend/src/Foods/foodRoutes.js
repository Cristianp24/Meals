const { Router } = require("express");
const { createFood, getAllFoods,deleteFood } = require("./foodController");


const router = Router();


router.get("/", getAllFoods);
router.post("/", createFood);
router.delete("/:id", deleteFood);



module.exports = router