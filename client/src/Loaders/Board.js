import { redirect } from "react-router-dom";

export async function boardsLoader() {
    const response = await fetch("/boards", {
        method: "get",
        headers: {
            "x-access-token": localStorage.getItem("token")
        }
    });

    if (!response.ok) {
        throw response;
    }

    const boardsJson = await response.json();

    return {boards: boardsJson.boards};
}

export async function boardContainerLoader({params}) {
    const response = await fetch(`/boards/${params.boardId}`, {
        method: "get",
        headers: {
            "x-access-token": localStorage.getItem("token")
        }
    });

    if (!response.ok) {
        throw response;
    }

    const boardJson = await response.json();

    return { board: boardJson.board }
}

export async function boardsAction({request}) {
    switch (request.method) {
        case "PUT": {
            const formData = await request.formData();
            const { title, description } = Object.fromEntries(formData);

            const response = await fetch("/boards", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw response;
            }

            const data = await response.json();

            return redirect(`/boards/${data.boardId}`);
        }
        default : {
            throw new Response("", { status: 405 });
        }
    }
}


export async function boardContainerAction({request, params}) {
    const formData = await request.formData();
    const type = formData.get("type");
    if (type === "TASK") return handleTaskRequest(request.method, formData, params);
    else if (type === "COLUMN") return handleColumnRequest(request.method, formData, params);
    else if (type === "BOARD") return handleBoardRequest(request.method, formData, params);
}


async function handleTaskRequest(method, formData, params) {
    const boardId = params.boardId;
    const formObj = Object.fromEntries(formData);
    const columnId = formObj.columnId;

    switch (method) {
        case "PUT": {
            const response = await fetch(`/boards/${boardId}/columns/${columnId}/tasks`, {
                method: "put",
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            });

            if (!response.ok) {
                throw response;
            }

            return response;
        }
        case "POST": {
            const { taskId, title, description } = formObj;
            const response = await fetch(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title, description: description ? description : ""
                })
            });

            if (!response) {
                throw response;
            }

            return response;
        }
        default : {
            throw new Response("", {status: 200});
        }
    }
}


async function handleColumnRequest(method, formData, params) {
    const boardId = params.boardId;

    switch (method) {
        case "PUT": {
            const response = await fetch(`/boards/${boardId}/columns`, {
                method: "put",
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            });

            if (!response.ok) {
                throw response;
            }

            return response;
        }
        case "POST": {
            const {columnId, title} = Object.fromEntries(formData);

            const response = await fetch(`/boards/${boardId}/columns/${columnId}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify({title})
            });

            if (!response.ok) {
                throw response
            }
            
            return response;
        }
        default : {
            throw new Response("", {status: 200});
        }
    }
}


async function handleBoardRequest(method, formData, params) {
    const boardId = params.boardId;
    const { editType, reorderType, sourceJson, destinationJson } = Object.fromEntries(formData);
    const source = JSON.parse(sourceJson);
    const destination = JSON.parse(destinationJson);

    source.droppableId = source.droppableId.substr(2);
    destination.droppableId = destination.droppableId.substr(2);

    switch (method) {
        case "POST": {
            if (editType === "REORDER") {
                const response = await fetch(`/boards/${boardId}/reorder/${reorderType}`, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token")
                    },
                    body: JSON.stringify({source, destination})
                });

                if (!response.ok) {
                    throw response;
                }

                return response;
            }        
            return new Response("", {status: 405});
        }

        default : {
            throw new Response("", {status: 200});
        }
    }
}