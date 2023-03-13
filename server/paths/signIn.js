const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/models");
require("dotenv").config();
const router = require("express").Router();


router.post("/", async (req, res) => {
    const { email, password } = req.body;

    User.findOne({email})
    .then(dbUser => {
        if (!dbUser) {
            return res.status(404).json({message: "Invalid Email Address or Password"});
        }
        bcrypt.compare(password, dbUser.password)
        .then(isCorrect => {
            if (isCorrect) {
                const payload = {
                    id: dbUser._id,
                    email: dbUser.email
                };
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {expiresIn: 86400},
                    (err, token) => {
                        if (err) return res.json({message: err});
                        return res.json({
                            message: "success",
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res.status(404).json({ message: "Invalid Email Address or Password"});
            }
        });
    });
});

module.exports = router;