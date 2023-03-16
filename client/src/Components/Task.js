import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSubmit, Form } from "react-router-dom";
import Modal from "./Modal";

import "./css/Task.css";

export default function Task(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const [taskCopy, setTaskCopy] = useState({
        title: props.title,
        description: props.description,
        hasChanged: false
    });
    const submit = useSubmit();
    
    const taskId = props.id.substr(2);

    // For Editing
    const onClick = e => {
        e.preventDefault();
        setIsModalVisible(true);
    };

    const onCancelClicked = e => {
        e.preventDefault();
        setIsModalVisible(false);
        setTaskCopy({
            title: props.title,
            description: props.description,
            hasChanged: false
        });
    };

    const onChange = (e, field) => {
        setTaskCopy({
            ...taskCopy,
            [field]: e.target.value,
            hasChanged: true
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        setIsModalVisible(false);
        console.log(taskCopy);
        if (taskCopy.hasChanged) {
            submit({
                columnId: props.columnId,
                type: "TASK",
                taskId: taskId,
                title: taskCopy.title,
                description: taskCopy.description
            }, {method: "POST"});
        }
    };

    // Delete
    const onDeleteTaskClicked = e => {
        e.preventDefault();
        setIsDeleteModalVisible(true);
    };

    const onDeleteTaskSubmit = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
        submit({
            type: "TASK",
            taskId,
            columnId: props.columnId,
        }, {method: "DELETE"});
    };

    const onDeleteTaskCancel = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
    };

    return (
        <>
            <Modal isShowing={isDeleteModalVisible} onCancel={onDeleteTaskCancel} title="Delete Task">
                <Form onSubmit={onDeleteTaskSubmit}>
                    <div className="my-3">
                        <p>
                            Are you sure you want to delete this task? <span className="fw-bold">It will be gone forever.</span><br />
                        </p>
                        <p className="fw-bold lead">
                            Name: {props.title}
                        </p>
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-1" onClick={onDeleteTaskClicked} value="Cancel"/>
                        <input type="submit" className="btn btn-danger" value="Delete Task"/>
                    </div>
                </Form>
            </Modal>
            <Modal isShowing={isModalVisible} onCancel={onCancelClicked} title={"View/Edit Task"}>
                <Form method="POST" onSubmit={onSubmit}>
                    <div className="my-3">
                        <label htmlFor="taskName" className="form-label">Task Name</label>
                        <input id="taskName" type="text" className="form-control" name="title"
                            value={taskCopy.title || ""}
                            onChange={e => onChange(e, "title")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="taskDescription" className="form-label">Description</label>
                        <textarea id="taskDescription" className="form-control mh-100" rows={5} name="description"
                            onChange={e => onChange(e, "description")}
                            value={taskCopy.description || ""}
                        ></textarea>
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-1" onClick={onCancelClicked} value={taskCopy.hasChanged ? "Cancel" : "Close"}/>
                        <input type="submit" className="btn btn-primary" value="Save Changes"
                            style={{
                                display: taskCopy.hasChanged ? "inline" : "none"
                            }}
                        />
                    </div>
                </Form>
            </Modal>
            <Draggable draggableId={props.id} index={props.index}>
                {(provided) => (
                    <div 
                        className="task my-2 py-2 border rounded-3 lh-sm d-flex justify-content-between"
                        style={{
                            maxWidth: "200px"
                        }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <div className="flex-grow-1 text-truncate ps-2" style={{minWidth: 0}} onClick={onClick}>{props.title}</div>
                        <div className="dropdown border-start pe-1">
                            <button className="btn lh-sm rounded-3 fs-6 btn-outline-secondary border-0 py-0 px-2" data-bs-toggle="dropdown" aria-expanded="false"
                                style={{
                                    height: "100%"
                                }} 
                            >
                                <i className="bi bi-three-dots-vertical"></i>
                                <span className="visually-hidden">Actions</span>
                            </button>
                            <ul className="dropdown-menu">
                                <li className="dropdown-item dropdown-action" onClick={onClick}>Edit</li>
                                <li><hr className="dropdown-divider"/></li>
                                <li className="dropdown-item dropdown-action text-danger" onClick={onDeleteTaskClicked}>Delete</li>
                            </ul>
                        </div>
                    </div>
                )}
            </Draggable>
        </>
    );
}