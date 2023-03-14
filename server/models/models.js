const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    }
});


const columnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Task"
    }
});


const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxLength: 150
    },
    columnOrder: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Column"
    },
}, {timestamps: true});


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    boards: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Board"
    }
}, {timestamps: true});


columnSchema.pre("findOneAndDelete", async function (next) {
    const columnDoc = await this.model.findOne(this.getFilter());
    if (!columnDoc) {
        next();
    }

    await mongoose.model("Task").deleteMany({
        _id: {
            $in: columnDoc.tasks
        }
    })
    next(); 
});


columnSchema.pre("deleteMany", async function(next) {
    const columnDocs = await this.model.find(this.getFilter());
    if (!columnDocs) {
        next();
    }

    for (const column of columnDocs) {
        await mongoose.model("Task").deleteMany({
            _id: {
                $in: column.tasks
            }
        });
    }

    next(); 
});


boardSchema.pre("findOneAndDelete", async function (next) {
    const boardDoc = await this.model.findOne(this.getFilter());
    if (!boardDoc) {
        next();
    }

    await mongoose.model("Column").deleteMany({
        _id: {
            $in: boardDoc.columnOrder
        }
    });
    next();
});


const Task = mongoose.model("Task", taskSchema);
const Column = mongoose.model("Column", columnSchema);
const Board = mongoose.model("Board", boardSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Task, Column, Board, User };