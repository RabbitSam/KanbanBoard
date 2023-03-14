import { useState } from "react";
import { useLoaderData, Form, useSubmit, useNavigation } from "react-router-dom";
import Board from "../Components/Board";
import Modal from "../Components/Modal";

export default function BoardContainer() {
    const { board } = useLoaderData();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [boardForm, setBoardForm] = useState({
        title: board.title,
        description: board.description
    });

    const submit = useSubmit();
    const navigation = useNavigation();

    const descriptionMaxLength = 150;

    const onEditBoardClicked = e => {
        e.preventDefault();
        setIsModalVisible(true);
        setBoardForm({
            title: board.title,
            description: board.description
        });
    };

    const onDeleteBoardClicked = e => {
        e.preventDefault();
        setIsDeleteModalVisible(true);
        setBoardForm({
            title: board.title,
            description: board.description
        });
    };
    
    const onBoardFormCancel = e => {
        e.preventDefault();
        setIsModalVisible(false);
    };

    const onDeleteBoardCanceled = e => {
        e.preventDefault();
        setIsDeleteModalVisible(false);
    }

    const onSubmit = e => {
        e.preventDefault();
        setIsModalVisible(false);
        submit({
            ...boardForm,
            type: "BOARD",
            editType: "EDIT"
        }, {method: "POST"});
    };

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
                    minHeight: "calc(100vh - 165px)",
                    backgroundColor: "darkgrey"
                }}>
                    {Object.keys(board).length ? <Board board={board} /> : <></>}
                </div>
            </div>
        </>
    );
}