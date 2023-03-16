const verifyJWT = require("./verifyJWT");
const { User, Board, Column, Task } = require("../models/models");
const { default: mongoose } = require("mongoose");

const router = require("express").Router();

// Board Routes
// Get all boards of this user
// Getters
router.get("/", verifyJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const dbUser = await User.findById(id).lean().populate("boards", "title description");
        if (!dbUser) {
            res.status(404).json({message: "Invalid user"});
        }
    
        res.status(200).json({message: "success", boards: dbUser.boards});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "An Unexpected Error Occured"});
        return;
    }
});

// Get individual board data
router.get("/:boardId", verifyJWT, async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const board = await Board.findById(boardId).populate("columnOrder");

        // Having to get the tasks of each column manually
        for (const column of board.columnOrder) {
            await column.populate("tasks", "title description");
        }

        res.status(200).json({message: "success", board});

    } catch(err) {
        console.log(err);
        res.status(500).json({message: "An Unexpected Error Occured"});
        return;
    }
    
});

// Putters
// Create a board
router.put("/", verifyJWT, async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.user;

    const dbBoard = new Board({
        title, description
    });

    await dbBoard.save();

    try {
        await User.findOneAndUpdate(
            {_id: id},
            {$push : { boards: dbBoard._id }}
        );
    
        res.status(200).json({message: "success", boardId: dbBoard._id});

    } catch(err) {
        console.log(err);
        res.status(500).json({message: "An Unexpected Error Occured"});
        return;
    }
    
});

// Posters
// Edit a board
router.post("/:boardId", verifyJWT, async (req, res) => {
    const boardId = req.params.boardId;
    const { title, description } = req.body;
    try {
        const dbBoard = await Board.findById(boardId);
        if (!dbBoard) {
            res.status(404).json({message: "Board does not exist."});
        }

        dbBoard.title = title;
        dbBoard.description = description;

        await dbBoard.save()

        res.status(200).json({message: "success"});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured."});
    } 
});


// Reorder columns in a board
router.post("/:boardId/reorder/columns", verifyJWT, async (req, res) => {
    const boardId = req.params.boardId;
    const { source, destination } = req.body;

    if (!destination) {
        res.status(404).json({message: "Destination does not exist."});
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
        res.status(200).json({message: "success"});
    }

    try {
        const dbBoard = await Board.findById(boardId);
        if (!dbBoard) {
            res.status(404).json({message: "Board does not exist."});
        }

        const columnOrder = [...dbBoard.columnOrder];
        const [movedColumn] = columnOrder.splice(source.index, 1);
        columnOrder.splice(destination.index, 0, movedColumn);

        dbBoard.columnOrder = columnOrder;

        await dbBoard.save();

        res.status(200).json({message: "success"});

    } catch(err) {
        console.log(err);
        res.status(500).json({message: "An Unexpected Error Occured"});
        return;
    }

    
});

// Deleters
// Delete a board
router.delete("/:boardId", verifyJWT, async (req, res) => {
    const boardId = req.params.boardId;
    try {
        await Board.findByIdAndDelete(boardId);
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $pull : { boards: boardId }
            }
        );

        res.status(200).json({message: "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An Unexpected Error Occured"});
    }
});


// Column methods
// Putters
// Add a column
router.put("/:boardId/columns", verifyJWT, async (req, res) => {
    const boardId = req.params.boardId;
    const title = "New Column";

    const dbColumn = new Column({ title });

    await dbColumn.save();

    try {
        await Board.findOneAndUpdate({
            _id: boardId
        },{
            $push : {columnOrder: dbColumn._id}
        });
    
        res.status(200).json({message: "success"});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured."});
    }
});

// Posters
// Edit a column
router.post("/:boardId/columns/:columnId", verifyJWT, async (req, res) => {
    const columnId = req.params.columnId;
    const { title } = req.body;

    try {
        const dbColumn = await Column.findById(columnId);
    
        if (!dbColumn) {
            res.status(404).json({message: "Column doesn't exist."});
        }
    
        dbColumn.title = title;
        await dbColumn.save();
    
        res.status(200).json({message: "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured."});
    }
});

// Deleters
// Delete a column
router.delete("/:boardId/columns/:columnId", verifyJWT, async(req, res) => {
    const boardId = req.params.boardId;
    const columnId = req.params.columnId;

    try {
        await Column.findByIdAndDelete(columnId);
        await Board.findByIdAndUpdate(boardId, {
            $pull : {columnOrder: columnId}
        });

        res.status(200).json({message: "An unexpected error occured."});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured."})
    }
});


// Reorder tasks
router.post("/:boardId/reorder/tasks", verifyJWT, async (req, res) => {
    const { source, destination } = req.body;

    if (!destination) {
        res.status(404).json({message: "Destination does not exist."});
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
        res.status(200).json({message: "success"});
    }

    try {
        if (source.droppableId === destination.droppableId) {
            // Reorder on the same column
            const dbSourceColumn = await Column.findById(source.droppableId);
            if (!dbSourceColumn) {
                res.status(404).json({message: "Column doesn't exist."});
            }
    
            const tasks = [...dbSourceColumn.tasks];
            const [movedTask] = tasks.splice(source.index, 1);
            tasks.splice(destination.index, 0, movedTask);
    
            dbSourceColumn.tasks = tasks;
            await dbSourceColumn.save();
    
            res.status(200).json({message: "success"});
    
        
        } else if (source.droppableId !== destination.droppableId) {
            // Reorder across columns
            const dbSourceColumn = await Column.findById(source.droppableId);
            const dbDestinationColumn = await Column.findById(destination.droppableId);
    
            if (!dbSourceColumn || !dbDestinationColumn) {
                res.status(404).json({message: "At least one of the source or destination columns doesn't exist."});
            }
    
            const sourceTasks = [...dbSourceColumn.tasks];
            const [movedTask] = sourceTasks.splice(source.index, 1);
    
            const destinationtasks = [...dbDestinationColumn.tasks];
            destinationtasks.splice(destination.index, 0, movedTask);
    
            dbSourceColumn.tasks = sourceTasks;
            dbDestinationColumn.tasks = destinationtasks;
    
            await dbSourceColumn.save();
            await dbDestinationColumn.save();
    
            res.status(200).json({message: "success"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured"});
    }

});


// Task methods
// Putters
router.put("/:boardId/columns/:columnId/tasks", verifyJWT, async (req, res) => {
    const columnId = req.params.columnId;
    const title = "New Task";

    const dbTask = new Task({ title });
    await dbTask.save();

    try {
        await Column.updateOne({
            _id: columnId
        }, {
            $push: {tasks: dbTask._id}
        });
    
        res.status(200).json({message: "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured"});  
    }
});

// Posters
router.post("/:boardId/columns/:columnId/tasks/:taskId", verifyJWT, async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description } = req.body;
    
    try {
        const dbTask = await Task.findById(taskId);
    
        if (!dbTask) {
            res.status(404).json({message: "task doesn't exist"});
        }
    
        dbTask.title = title;
        dbTask.description = description;
    
        await dbTask.save();
        
        res.status(200).json({message: "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured"});
    }
});


// Deleters
// Delete a task
router.delete("/:boardId/columns/:columnId/tasks/:taskId", verifyJWT, async(req, res) => {
    const taskId = req.params.taskId;
    
    try {
        await Task.findByIdAndDelete(taskId);
        
        res.status(200).json({message: "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "An unexpected error occured"});
    }
});

module.exports = router;