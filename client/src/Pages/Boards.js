import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Boards.css";

const dummyBoards = [
    {
        id: "1",
        name: "Hello 123",
        description: ""
    },
    {
        id: "2",
        name: "Hello 234",
        description: "Hello darkness my old friend"
    },
    {
        id: "3",
        name: "Hello 345",
        description: "Hello darkness my old friend"
    },
    {
        id: "4",
        name: "Hello 456",
        description: "Hello darkness my old friend. I've come to talk to you again. Because a vision softly creeping. Lifted sounds while I was sleeping and the vision that was planted in my brain still remains within the sound of silence."
    }
];

export default function Boards() {
    const [boards, setBoards] = useState([...dummyBoards]);

    const addBoard = e => {
        e.preventDefault();
        const newBoards = [...boards];
        newBoards.push({
            id: `${newBoards.length + 1}`,
            name: "New Board",
            description: ""
        });

        setBoards(newBoards);
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
                    {boards.map((board, index) => (
                        <div className="col my-2" key={index}>
                            <Link to={`/boards/${index}`} className="text-decoration-none text-dark card card-hover h-100">
                                <div className="card-body">
                                    <h2 className="card-title h5">{board.name}</h2>
                                    <p className="card-text text-truncate">{board.description}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button id="add-board" className="btn btn-primary rounded-pill position-sticky" onClick={addBoard}>
                    <i className="bi bi-plus-lg"></i>&nbsp;
                    Add Board
                </button>
            </div>
        </>
    );
}