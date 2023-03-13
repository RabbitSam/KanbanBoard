const jwt = require("jsonwebtoken");
require("dotenv").config();


function verifyJWT(req, res, next) {
    const token = req.get("x-access-token").split(" ")[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.json({
                isLoggedIn: false,
                message: "Failed To Authenticate"
            });

            req.user = {
                id: decoded.id,
                email: decoded.email
            };
            next();
        });
    } else {
        res.json({message: "Incorrect Token Given", isLoggedIn: false});
    }
}


module.exports = verifyJWT;