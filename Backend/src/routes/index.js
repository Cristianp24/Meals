const { Router } = require("express");
const userRoutes = require("../Users/userRoutes");

const router = Router();


router.use("/users", userRoutes);

router.get("/foods", (req, res) => {
    res.status(200).send({
        message: "Hello, I'm the foods endpoint!",
    });
});

router.get("/meals", (req, res) => {
    res.status(200).send({
        message: "Hello, I'm the meals endpoint!",
    });
});



module.exports = router;