
const mongoose = require("mongoose");
const { User } = require("../models/models");

async function verifyUserBoard(req, res, next) {
    try {
        const dbUser = await User.findById(req.user.id).lean();

        if (!dbUser) {
            res.status(404).json({message: "User does not exist"});
        }

        const boardId = new mongoose.Types.ObjectId(req.params.boardId);
        
        if (dbUser.boards.some(item => item.equals(boardId))) {
            next();
        } else {
            res.status(403).json({message: "User can't view/edit this board or its contents."});
        }

    } catch (err) {
        res.status(500).json({message: "An unexpected error occured."});
    }
}

module.exports = verifyUserBoard;