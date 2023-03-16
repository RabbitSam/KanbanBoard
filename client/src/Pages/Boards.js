import { useState } from "react";
import { Link, useLoaderData, Form, useSubmit, useNavigation } from "react-router-dom";
import Modal from "../Components/Modal";
import "./css/Boards.css";

export default function Boards() {
    const { boards } = useLoaderData();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [boardForm, setBoardForm] = useState({
        title: "",
        description: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const submit = useSubmit();
    const navigation = useNavigation();

    const descriptionMaxLength = 150;

    const onAddBoardClicked = e => {
        e.preventDefault();
        setBoardForm({
            title: "",
            description: ""
        });
        setIsModalVisible(true);
        setIsEditing(false);
    };

    const onEditBoardClicked = (e, board) => {
        e.preventDefault();
        setBoardForm({
            ...board
        });
        setIsModalVisible(true);
        setIsEditing(true);
    };

    const onDeleteBoardClicked = (e, board) => {
        e.preventDefault();
        console.log(board);
        setBoardForm({
            ...board
        });  
        setIsDeleteModalVisible(true);
    };

    const onBoardFormCancel = (e) => {
        e.preventDefault();
        setIsModalVisible(false);
        setIsEditing(false);
    };

    const onBoardFormInput = (e, field) => {
        e.preventDefault();
        setBoardForm({
            ...boardForm,
            [field]: e.target.value
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        setIsModalVisible(false);
        setIsEditing(false);
        if (isEditing) {
            submit({
                ...boardForm
            }, {method: "POST"});
        } else {
            submit({
                ...boardForm
            }, {method: "PUT"});
        }
    };

    const onDeleteBoardCanceled = e => {
        e.preventDefault();
        setBoardForm({
            title: "",
            description: ""
        });
        setIsDeleteModalVisible(false);
    };

    const onDeleteBoardSubmit = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
        submit({
            ...boardForm
        }, {method: "delete"});
        
    };


    return (
        <>
            <div className="container-fluid">
                <div className="row my-4">
                    <div className="col col-12 text-center">
                        <h1 className="display-5 fw-bold">Your Boards</h1>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                    <div className="col my-2">
                        <div 
                            id="card-button" 
                            className="text-decoration-none text-light card h-100 bg-secondary"
                            onClick={onAddBoardClicked}
                        >
                            <div className="card-body">
                                <h2 className="card-title h5 mt-2 mt-md-3">
                                    <i className="bi bi-plus-circle"></i> Add Board
                                </h2>
                            </div>
                        </div>
                    </div>
                    {boards.map((board, index) => (
                        <div className="col my-2" key={index}>
                            <div className="card card-hover h-100">
                                <div className="card-body d-flex justify-content-between">
                                    <Link to={`/boards/${board._id}`} className="text-decoration-none text-dark flex-grow-1 pe-3" style={{minWidth: "0"}}>
                                        <h2 className={`card-title h5 pb-1 text-truncate ${navigation.state === "idle" ? "" : "placeholder-glow"}`}>
                                            <span className={navigation.state === "idle" ? "": "placeholder"}>{board.title}</span>
                                        </h2>
                                        <p className={`card-text text-truncate ${navigation.state === "idle" ? "" : "placeholder-glow"}`}>
                                            <span className={navigation.state === "idle" ? "" : "placeholder"}>
                                                {board.description ? board.description : <em className="text-muted">No Description</em>}
                                            </span>
                                        </p>
                                    </Link>
                                    <div className="dropdown border-start rounded-0">
                                        <button className="btn fs-5 mt-2 rounded-4 btn-outline-secondary border-0 ms-1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-three-dots-vertical"></i>
                                            <span className="visually-hidden">Actions</span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li className="dropdown-item dropdown-action" onClick={e => onEditBoardClicked(e, board)}>Edit</li>
                                            <li><hr className="dropdown-divider"/></li>
                                            <li className="dropdown-item dropdown-action text-danger" onClick={e => onDeleteBoardClicked(e, board)}>Delete</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                title={isEditing ? "Edit Board": "Add Board"}
                isShowing={isModalVisible}
                onCancel={onBoardFormCancel}
            >
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
                        <input type="submit" className="btn btn-primary" value={isEditing ? "Save Changes" : "Create Board"}
                            style={{
                                display: boardForm.title ? "inline" : "none"
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
        </>
    );
}