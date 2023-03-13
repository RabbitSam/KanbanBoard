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


const Task = mongoose.model("Task", taskSchema);
const Column = mongoose.model("Column", columnSchema);
const Board = mongoose.model("Board", boardSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Task, Column, Board, User };