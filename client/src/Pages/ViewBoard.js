import { useLoaderData } from "react-router-dom";
import Board from "../Components/Board";

export default function ViewBoard() {
    const { board } = useLoaderData();
    
    return (
        <>
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col col-12">
                        <h1 className="h4">{board.name}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-12">
                        <p className="lead fs-6 text-truncate">
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