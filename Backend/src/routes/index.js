const { Router } = require("express");


const router = Router();


router.get("/users", (req, res) => {
    res.status(200).send({
        message: "Hello, I'm the users endpoint!",
    });
});

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