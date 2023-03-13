const verifyJWT = require("./verifyJWT");

const router = require("express").Router();

router.get("/", verifyJWT, async(req, res) => {
    res.status(200).json({
        isLoggedIn: true,
        message: "success"
    });
});

module.exports = router;