import { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Form, useNavigation, useSubmit } from 'react-router-dom';
import Task from './Task';
import Modal from './Modal';
import "./css/Column.css";

function Column(props) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const inputReference = useRef();
    const submit = useSubmit();
    const navigation = useNavigation();

    const columnId = props.id.substr(2);

    // If the user is editing, then focus on the input as soon as it renders.
    useEffect(() => {
        if (inputReference.current) {
            inputReference.current.focus();
        }
    });

    // Name Edit Functions
    const onClick = e => {
        e.preventDefault();
        setIsEditingName(true);
    };

    const onNameChange = e => {
        setTitle(e.target.value);
    };

    const onBlur = e => {
        e.preventDefault();
        setIsEditingName(false);
        if (title !== props.title) {
            submit({
                type: "COLUMN",
                columnId: columnId,
                title: title 
            }, {method: "POST"});
        }
    };

    const onSubmit = e => {
        e.preventDefault();
        setIsEditingName(false);
        if (title !== props.title) {
            submit({
                type: "COLUMN",
                columnId: columnId,
                title: title 
            }, {method: "POST"});
        }
    };

    // Delete functions
    const onDeleteColumnClicked = e => {
        e.preventDefault();
        setIsDeleteModalVisible(true);
    };

    const onDeleteColumnSubmit = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
        submit({
            type: "COLUMN",
            columnId: columnId
        }, {method: "DELETE"});
    };


    const onDeleteColumnCancel = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
    };

    //Style
    const style = {
        maxWidth: "250px"
    };

    return (
        <>
            <Modal isShowing={isDeleteModalVisible} onCancel={onDeleteColumnCancel} title="Delete Column">
                <Form onSubmit={onDeleteColumnSubmit}>
                    <div className="my-3">
                        <p>
                            Are you sure you want to delete this Column? <span className="fw-bold">It and it's tasks will be gone forever.</span><br />
                        </p>
                        <p className="fw-bold lead">
                            Name: {title}
                        </p>
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-1" onClick={onDeleteColumnCancel} value="Cancel"/>
                        <input type="submit" className="btn btn-danger" value="Delete Column"/>
                    </div>
                </Form>
            </Modal>
            <Draggable 
                draggableId={props.id}
                index={props.index}
            >
                {(provided) => (
                    <div
                        className="m-1 border rounded-1 bg-white"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        {
                            !isEditingName &&
                            <div 
                                className="px-2 pt-2 d-flex justify-content-between"
                                style={style}
                                {...provided.dragHandleProps}
                            >
                                <h5
                                    className={`column-title text-truncate py-2 px-2 rounded flex-grow-1 ${navigation.state !== "idle" ? "placeholder-glow" : ""}`}
                                    onClick={onClick}
                                    style={{ minWidth: "0" }}
                                >
                                    {navigation.state !== "idle" ? <div className="placeholder col-12"></div> : title}
                                </h5>
                                <div className="dropdown">
                                    <button className="btn lh-sm rounded-3 btn-sm btn-outline-secondary border-0 py-2 mt-1" data-bs-toggle="dropdown" aria-expanded="false" >
                                        <i className="bi bi-three-dots"></i>
                                        <span className="visually-hidden">Actions</span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item dropdown-action" onClick={onClick}>Edit</li>
                                        <li><hr className="dropdown-divider"/></li>
                                        <li className="dropdown-item dropdown-action text-danger" onClick={onDeleteColumnClicked}>Delete</li>
                                    </ul>
                                </div>
                            </div>
                        }
                        {
                            isEditingName &&
                            <div 
                                className="px-2 py-2"
                                {...provided.dragHandleProps} 
                                style={style}
                            >
                                <Form method="POST" onSubmit={onSubmit}>
                                    <label htmlFor="columnName" className="visually-hidden">Enter New Title</label>
                                    <input
                                        ref={inputReference}
                                        className="px-2 form-control fs-5 lh-sm"
                                        id="columnName"
                                        type="text"
                                        name="title"
                                        value={title}
                                        onChange={onNameChange}
                                        onBlur={onBlur}
                                    />
                                    <div className="d-none">
                                        <input type="submit" />
                                    </div>
                                </Form>
                            </div>
                        }
                        <div
                            style={{
                                minWidth: "250px",
                                maxWidth: "250px",
                            }}
                        >
                            <Droppable droppableId={props.id} direction="vertical" type="tasks">
                                {(provided) => (
                                    <div
                                        className="border-top border-bottom px-2 py-1 bg-light bg-light-subtle"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            overflowY: "auto",
                                            overflowX: "hidden",
                                            maxHeight: "calc(100vh - 350px)",
                                            minHeight: "calc(100vh - 350px)"
                                            // marginBottom: "5px"
                                        }}
                                    >
                                        {navigation.state !== "idle" && (
                                            <div className="placeholder-glow pt-3">
                                                <p className="placeholder col-12"></p>
                                                <p className="placeholder col-12"></p>
                                                <p className="placeholder col-12"></p>
                                                <p className="placeholder col-12"></p>
                                            </div>
                                        )}
                                        { navigation.state === "idle" &&
                                            props.tasks.map((task, index) => (
                                                <Task 
                                                    key={`t-${task._id}`}
                                                    index={index}
                                                    id={`t-${task._id}`}
                                                    title={task.title}
                                                    description={task.description}
                                                    columnId={columnId}
                                                />
                                            ))
                                        }
                                        { navigation.state === "idle" && provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <div className="d-grid px-2 pb-2 pt-1" style={{width:"100%"}}>
                                <Form method="PUT">
                                    <div className="d-none">
                                        <input type="text" name="type" value="TASK" readOnly/>
                                        <input type="text" name="columnId" value={columnId} readOnly/>
                                    </div>
                                    <button type="submit" className="btn btn-add" style={{width: "100%"}}>
                                        <i className="bi bi-plus"></i> Add Task
                                    </button>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        </>
    );
}

export default Column;