import React, { useState } from 'react';
import './App.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import List from './Components/List';
import Modal from './Components/Modal';


function App() {
    const [columnOrder, setColumnOrder] = useState([]);
    const [columnId, setColumnId] = useState(0);
    const [taskId, setTaskId] = useState(0);
    const [columns, setColumns] = useState({});
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [editTaskCopy, setEditTaskCopy] = useState({});

    const onDragEnd = result => {
        const {source, destination, type, draggableId} = result;

        if (!destination) {
            return;
        }

        // Won't have to do anything if the item being dropped is being put to the same location it was.
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        if (type === "task") {
            if (source.droppableId === destination.droppableId) {
                // Move Tasks around
                const columnCopy = {...columns[source.droppableId]};
                const tasksCopy = [...columnCopy.tasks];
                const [removed] = tasksCopy.splice(source.index, 1);
                tasksCopy.splice(destination.index, 0, removed);

                const newColumn = {
                    ...columnCopy,
                    tasks: tasksCopy
                };

                setColumns({
                    ...columns,
                    [source.droppableId]: newColumn
                });

            } else if (source.droppableId !== destination.droppableId) {

                // Remove task from source column
                const sourceColumn = {...columns[source.droppableId]};
                const sourceTasks = [...sourceColumn.tasks];
                const [movedTask] = sourceTasks.splice(source.index, 1);
                
                // Add task to destination column
                const destinationColumn = {...columns[destination.droppableId]};
                const destinationTasks = [...destinationColumn.tasks];
                destinationTasks.splice(destination.index, 0, movedTask);

                const newColumns = {
                    ...columns,
                    [source.droppableId]: {
                        ...sourceColumn,
                        tasks: sourceTasks
                    },
                    [destination.droppableId]: {
                        ...destinationColumn,
                        tasks: destinationTasks
                    }
                };

                setColumns(newColumns);
            }
        } else if (type === "column") {
            const newColumnOrder = [...columnOrder];
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            setColumnOrder(newColumnOrder);
        }
    };

    // Column Functions
    const addColumn = () => {
        const newColumnId = `c-${columnId.toString()}`;

        const newColumn = {
            title: "New List",
            tasks: []
        };

        const newColumns = {
            ...columns,
            [newColumnId]: newColumn
        }

        const newColumnOrder = [...columnOrder];
        newColumnOrder.push(newColumnId);

        setColumns(newColumns);
        setColumnOrder(newColumnOrder);
        setColumnId(columnId + 1);
    };

    const renameColumn = (e, columnId) => {
        const newColumn = {
            ...columns[columnId],
            title: e.target.value
        };

        const newColumns = {
            ...columns,
            [columnId]: newColumn
        }

        setColumns(newColumns);
    };

    // Task Functions
    const addTask = (columnId) => {
        const newTaskId = `t-${taskId.toString()}`;

        const newTask = {
            id: newTaskId,
            title: `New Task ${newTaskId}`,
            description: ""
        };

        const columnCopy = {...columns[columnId]};

        columnCopy.tasks.push(newTask);

        setColumns({
            ...columns,
            [columnId]: columnCopy
        });
        setTaskId(taskId + 1);
    };

    const viewEditTask = (columnId, index) => {
        // Using a copy so that the user can cancel changes
        const task = {...columns[columnId].tasks[index]};
        setEditTaskCopy({
            ...task,
            columnId,
            index,
            hasChanged: false
        });
        setIsEditingTask(true);
    };

    const onTaskChange = (e, field) => {
        e.preventDefault();
        setEditTaskCopy({
            ...editTaskCopy,
            [field]: e.target.value,
            hasChanged: true
        });
    };

    const onTaskChangeSave = e => {
        e.preventDefault();
        const {columnId, index, title, description, hasChanged} = editTaskCopy;
        if (hasChanged) {
            const columnCopy = {...columns[columnId]};
            const tasksCopy = [...columnCopy.tasks];
            tasksCopy[index] = {
                ...tasksCopy[index],
                title, description
            };

            setColumns({
                ...columns,
                [columnId]: {
                    ...columns[columnId],
                    tasks: tasksCopy
                }
            });

            setEditTaskCopy({});
            setIsEditingTask(false);
        }
    };

    const cancelEditTask = e => {
        e.preventDefault();
        setEditTaskCopy({});
        setIsEditingTask(false);
    };

    return (
        <div className="container-fluid"
            style={{
                overflowX: (isEditingTask ? "hidden" : "visible")
            }}
        >
            <Modal isShowing={isEditingTask} onCancel={cancelEditTask} title={"View/Edit Task"}>
                <form onSubmit={onTaskChangeSave}>
                    <div className="my-3">
                        <label htmlFor="taskName" className="form-label">Task Name</label>
                        <input id="taskName" type="text" className="form-control" 
                            value={editTaskCopy.title ? editTaskCopy.title : ""}
                            onChange={e => onTaskChange(e, "title")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="taskDescription" className="form-label">Description</label>
                        <textarea id="taskDescription" className="form-control mh-100" rows={5}
                            onChange={e => onTaskChange(e, "description")}
                            value={editTaskCopy.description ? editTaskCopy.description : ""}
                        ></textarea>
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-3" onClick={cancelEditTask} value="Close"/>
                        <input type="submit" className="btn btn-primary" value="Save Changes"
                            style={{
                                display: editTaskCopy.hasChanged ? "inline" : "none"
                            }}
                        />
                    </div>
                </form>
            </Modal>
            <div className="list-group list-group-horizontal mt-2 mx-3">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="columns" direction="horizontal" type="column">
                        {(provided) => (
                            <div
                                className="list-group list-group-horizontal"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {columnOrder.map((cid, index) => (
                                    <List 
                                        key={cid}
                                        id={cid}
                                        onTaskAdd={addTask}
                                        {...columns[cid]}
                                        index={index}
                                        onNameChange={renameColumn}
                                        onTaskClick={viewEditTask}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="m-2">
                    <input type="button" value="Add Column" className="btn btn-secondary" onClick={addColumn}/>
                </div>
            </div>
        </div>
    );
}

export default App;
