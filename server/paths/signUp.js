const bcrypt = require("bcrypt");
const { User } = require("../models/models");

const router = require("express").Router();

router.put("/", async (req, res) => {
    const { name, email, password } = req.body;
    const takenEmail = await User.findOne({email});

    if (takenEmail) {
        res.status(409).json({message: "Email is already in use."});
    } else {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const dbUser = new User({
            name, email,
            password: encryptedPassword
        });

        dbUser.save();
        res.status(200).json({message: "success"});
    }
});

router.delete("/:userId", async(req, res) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
});

module.exports = router;