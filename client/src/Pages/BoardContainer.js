import { useState } from "react";
import { useLoaderData, Form, useSubmit, useNavigation } from "react-router-dom";
import Board from "../Components/Board";
import Modal from "../Components/Modal";

export default function BoardContainer() {
    const { board } = useLoaderData();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isReorderModalVisible, setIsReorderModalVisible] = useState(false);

    const [boardForm, setBoardForm] = useState({
        title: board.title,
        description: board.description
    });

    const [reorderForm, setReorderForm] = useState({
        reorderType: "tasks",
        reorderFromColumn: 0,
        reorderTask: 0,
        reorderToColumn: 0,
        reorderToPosition: 0,
        reorderColumn: 0
    });

    const submit = useSubmit();
    const navigation = useNavigation();

    const descriptionMaxLength = 150;

    // Edit
    const onEditBoardClicked = e => {
        e.preventDefault();
        setIsModalVisible(true);
        setBoardForm({
            title: board.title,
            description: board.description
        });
    };
    
    const onBoardFormCancel = e => {
        e.preventDefault();
        setIsModalVisible(false);
    };
    
    const onSubmit = e => {
        e.preventDefault();
        setIsModalVisible(false);
        submit({
            ...boardForm,
            type: "BOARD",
            editType: "EDIT"
        }, {method: "POST"});
    };
    
    // Delete
    const onDeleteBoardClicked = e => {
        e.preventDefault();
        setIsDeleteModalVisible(true);
        setBoardForm({
            title: board.title,
            description: board.description
        });
    };

    const onDeleteBoardCanceled = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
    }
    
    const onDeleteBoardSubmit = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
        submit({
            type: "BOARD",
        }, {method: "DELETE"});
    };
    
    const onBoardFormInput = (e, field) => {
        setBoardForm({
            ...boardForm,
            [field]: e.target.value
        });
    };

    // Swap
    const onReorderClicked = e => {
        e.preventDefault();
        setIsReorderModalVisible(true);
    };

    const onReorderCancel = e => {
        e.preventDefault();
        setIsReorderModalVisible(false);
    };

    const onReorderSubmit = e => {
        e.preventDefault();
        setIsReorderModalVisible(false);

        const reorderFormCopy = {...reorderForm};
        if (reorderFormCopy.reorderType === "tasks") {
            const {reorderType, reorderFromColumn, reorderTask, reorderToColumn, reorderToPosition} = reorderFormCopy;
            
            const source = {
                droppableId: board.columnOrder[reorderFromColumn]._id,
                index: reorderTask
            };

            const destination = {
                droppableId: board.columnOrder[reorderToColumn]._id,
                index: reorderToPosition
            }

            // Because the element is removed from the target column, the target position needs to be reduced by 1
            if (source.droppableId === destination.droppableId && destination.index !== 0) {
                destination.index -= 1;
            }

            submit({
                type: "BOARD",
                editType: "REORDER",
                reorderType,
                sourceJson: JSON.stringify(source),
                destinationJson: JSON.stringify(destination),
            }, {method: "POST"});
        } else if (reorderForm.reorderType === "columns") {
            const {reorderType, reorderColumn, reorderToPosition} = reorderFormCopy;
            
            const source = {
                droppableId: "b-columns",
                index: reorderColumn
            };

            const destination = {
                droppableId: "b-columns",
                index: reorderToPosition
            };

            // Because the element is removed from the board, the target position needs to be reduced by 1
            if (destination.index !== 0) {
                destination.index -= 1;
            }

            submit({
                type: "BOARD",
                editType: "REORDER",
                reorderType,
                sourceJson: JSON.stringify(source),
                destinationJson: JSON.stringify(destination),
            }, {method: "POST"});
        }

        setReorderForm({
            reorderType: "tasks",
            reorderFromColumn: 0,
            reorderTask: 0,
            reorderToColumn: 0,
            reorderToPosition: 0,
            reorderColumn: 0
        });
    };

    const onReorderInput = (e, field) => {
        e.preventDefault();

        // Only reorderType field is words, rest are all numbers.
        setReorderForm({
            ...reorderForm,
            [field]: field === "reorderType" ? e.target.value : Number(e.target.value)
        });


    };

    // For tasks, shows a list of all the tasks.
    const getFromColumnTasks = () => {
        const fromColumn = board.columnOrder[reorderForm.reorderFromColumn];
        if (!!fromColumn && !!fromColumn.tasks) {
            const tasks = [...fromColumn.tasks];

            if (!tasks.length) {
                return;
            } else {
                return tasks.map((task, index) => (
                    <option value={index} key={task._id}>{task.title}</option>
                ));
            }
        }
    };

    // For tasks, shows a list of possible positions in the target column
    const getToColumnPositions = () => {
        const toColumn = {...board.columnOrder[reorderForm.reorderToColumn]};

        if (!!toColumn && !!toColumn.tasks) {
            const tasks = [...toColumn.tasks];

            if (!tasks.length) {
                return (
                    <option value={0}>Start</option>
                );
            } else {
                const isSameColumn = reorderForm.reorderFromColumn === reorderForm.reorderToColumn;
                return (
                    <>
                        {
                            tasks.map((task, index) => {
                                let optionText = index === 0 ? "Start" : `After ${tasks[index - 1].title}`;
                                if (isSameColumn && reorderForm.reorderTask === index) {
                                    return (
                                        <option className="d-none" value={index} key={task._id} disabled>Original Position</option>
                                    );
                                } else if (isSameColumn && (reorderForm.reorderTask + 1) === (index)) {
                                    return <option className="d-none" value={index} key={task._id} disabled>Original Position</option>
                                }
                                return (
                                    <option value={index} key={task._id}>{optionText}</option>
                                );
                            })
                        }
                        {
                            // If it's not (the same column and the last item of that column)
                            !(isSameColumn && reorderForm.reorderTask === tasks.length - 1) && <option value={tasks.length}>End</option>
                        }
                    </>
                );
            }
        }
    };

    // For columns, shows a list of possible positions.
    const getColumnReorderPositions = () => {
        const columns = board.columnOrder;
        return (
            <>
                {
                    columns.map((column, index) => {
                        const optionText = index === 0 ? "Start" : `After ${columns[index - 1].title}`;

                        if (reorderForm.reorderColumn === index || reorderForm.reorderColumn + 1 === index) {
                            return (
                                <option className="d-none" value={index} key={column._id} disabled>Original Position</option>
                            );
                        }

                        return (
                            <option value={index} key={column._id}>{optionText}</option>
                        );
                    })
                }
                {
                    // If it's the last item of the board
                    reorderForm.reorderColumn !== columns.length - 1 && <option value={columns.length}>End</option>
                }
            </>
        );
    };


    return (
        <>
            <Modal isShowing={isModalVisible} onCancel={onBoardFormCancel} title={"Edit Board"}>
                <Form onSubmit={onSubmit}>
                    <div className="my-3">
                        <label htmlFor="boardName" className="form-label">Board Name</label>
                        <input id="boardName" type="text" name="title" className="form-control" 
                            value={boardForm.title ? boardForm.title : ""}
                            onChange={e => onBoardFormInput(e, "title")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="boardDescription" className="form-label">Description (Max. 150 characters | Optional)</label>
                        <textarea id="boardDescription" name="description" className="form-control mh-100" rows={5} maxLength={descriptionMaxLength}
                            onChange={e => onBoardFormInput(e, "description")}
                            value={boardForm.description ? boardForm.description : ""}
                        ></textarea>
                        <div className="form-text">{boardForm.description ? boardForm.description.length : 0}/{descriptionMaxLength}</div>
                    </div>
                    <div>
                        <input type="text" name="type" value="board" className="d-none" readOnly/>
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-1" onClick={onBoardFormCancel} value="Cancel"/>
                        <input type="submit" className="btn btn-primary" value="Save Changes"
                            style={{
                                display: boardForm.title && (boardForm.title !== board.title || boardForm.description !== board.description) ? "inline" : "none"
                            }}
                        />
                    </div>
                </Form>
            </Modal>
            <Modal title="Delete Board" isShowing={isDeleteModalVisible} onCancel={onDeleteBoardCanceled}>
                <Form onSubmit={onDeleteBoardSubmit}>
                    <div className="my-3">
                        <p>
                            Are you sure you want to delete this board? <span className="fw-bold">It will be gone forever.</span><br />
                        </p>
                        <p className="fw-bold lead">
                            Name: {boardForm.title}
                        </p>
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-1" onClick={onDeleteBoardCanceled} value="Cancel"/>
                        <input type="submit" className="btn btn-danger" value="Delete Board"/>
                    </div>
                </Form>
            </Modal>
            <Modal title="Move Columns/Tasks" isShowing={isReorderModalVisible} onCancel={onReorderCancel}>
                <Form onSubmit={onReorderSubmit}>
                    <div className="my-3">
                        <div className="row mb-2">
                            <label htmlFor="reorderType" className="form-label col-12 col-sm-4 pt-1">Move</label>
                            <div className="col-12 col-sm-8">
                                <select
                                    name="reorderType"
                                    id="reorderType"
                                    className="form-select"
                                    value={reorderForm.reorderType}
                                    onChange={e => onReorderInput(e, "reorderType")}
                                >
                                    <option value="tasks">Task</option>
                                    <option value="columns">Column</option>
                                </select>
                            </div>
                        </div>
                        { reorderForm.reorderType === "tasks" && 
                            <>
                                <div className="row mb-2">
                                    <label htmlFor="reorderFromColumn" className="form-label col-12 col-sm-4 pt-1">From Column</label>
                                    <div className="col-12 col-sm-8">
                                        <select
                                            name="reorderFromColumn"
                                            id="reorderFromColumn"
                                            className="form-select"
                                            value={reorderForm.reorderFromColumn}
                                            onChange={e => onReorderInput(e, "reorderFromColumn")}
                                        >
                                            {
                                                board.columnOrder.map((column, index) => (
                                                    <option key={column._id} value={index}>{column.title}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="reorderTask" className="form-label col-12 col-sm-4 pt-1">Task</label>
                                    <div className="col-12 col-sm-8">
                                        <select
                                            name="reorderTask"
                                            id="reorderTask"
                                            className="form-select"
                                            value={reorderForm.reorderTask}
                                            onChange={e => onReorderInput(e, "reorderTask")}
                                        >
                                            {getFromColumnTasks()}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="reorderToColumn" className="form-label col-12 col-sm-4 pt-1">To Column</label>
                                    <div className="col-12 col-sm-8">
                                        <select
                                            name="reorderToColumn"
                                            id="reorderToColumn"
                                            className="form-select"
                                            value={reorderForm.reorderToColumn}
                                            onChange={e => onReorderInput(e, "reorderToColumn")}
                                        >
                                            {
                                                board.columnOrder.map((column, index) => (
                                                    <option key={column._id} value={index}>{column.title}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="reorderToPosition" className="form-label col-12 col-sm-4 pt-1">At Position</label>
                                    <div className="col-12 col-sm-8">
                                        <select
                                            name="reorderToPosition"
                                            id="reorderToPosition"
                                            className="form-select"
                                            value={reorderForm.reorderToPosition}
                                            onChange={e => onReorderInput(e, "reorderToPosition")}
                                        >
                                            {getToColumnPositions()}
                                        </select>
                                    </div>
                                </div>
                            </>
                        }
                        { reorderForm.reorderType === "columns" && 
                            <>
                                <div className="row mb-2">
                                    <label htmlFor="reorderColumn" className="form-label col-12 col-sm-4 pt-1">Column</label>
                                    <div className="col-12 col-sm-8">
                                        <select
                                            name="reorderColumn"
                                            id="reorderColumn"
                                            className="form-select"
                                            value={reorderForm.reorderColumn}
                                            onChange={e => onReorderInput(e, "reorderColumn")}
                                        >
                                            {
                                                board.columnOrder.map((column, index) => (
                                                    <option key={column._id} value={index}>{column.title}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="reorderToPosition" className="form-label col-12 col-sm-4 pt-1">To Position</label>
                                    <div className="col-12 col-sm-8">
                                        <select
                                            name="reorderToPosition"
                                            id="reorderToPosition"
                                            className="form-select"
                                            value={reorderForm.reorderToPosition}
                                            onChange={e => onReorderInput(e, "reorderToPosition")}
                                        >
                                            {getColumnReorderPositions()}
                                        </select>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-1" onClick={onReorderCancel} value="Cancel"/>
                        <input type="submit" className="btn btn-primary" value={`Move ${reorderForm.reorderType.charAt(0).toUpperCase()}${reorderForm.reorderType.substring(1, reorderForm.reorderType.length - 1)}`}/>
                    </div>
                </Form>
            </Modal>
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col col-12 d-flex justify-content-between">
                        <div className={`flex-grow-1 ${navigation.state !== "idle" && "placeholder-glow"}`} style={{minWidth: 0}}>
                            <h1 className={`h4 text-truncate ${navigation.state !== "idle" && "placeholder"}`}>{board.title}</h1>
                        </div>
                        <div className="dropdown rounded-0">
                            <button className="btn lh-sm rounded-3 btn-outline-secondary border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-three-dots"></i>
                                <span className="visually-hidden">Actions</span>
                            </button>
                            <ul className="dropdown-menu">
                                <li className="dropdown-item dropdown-action" onClick={onEditBoardClicked}>Edit</li>
                                <li className={`dropdown-item dropdown-action ${!board.columnOrder.length ? "d-none" : ""}`} onClick={onReorderClicked}>Move Columns/Tasks</li>
                                <li><hr className="dropdown-divider"/></li>
                                <li className="dropdown-item dropdown-action text-danger" onClick={onDeleteBoardClicked}>Delete</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={`col col-12 ${navigation.state !== "idle" && "placeholder-glow"}`}>
                        <p className={`lead fs-6 ${navigation.state !== "idle" && "placeholder"}`}>
                            {board.description ? board.description : (
                                <span className="text-muted"><em>No Description</em></span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="border rounded px-2" style={{
                    overflow: "auto",
                    minHeight: "calc(100vh - 205px)",
                    backgroundColor: "darkgrey",
                }}>
                    {Object.keys(board).length ? <Board board={board} /> : <></>}
                </div>
            </div>
        </>
    );
}