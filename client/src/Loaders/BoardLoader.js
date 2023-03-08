import { dummyBoards, dummyLists } from "../Dummies/dummyBoards";

async function getBoards() {
    await new Promise (res => setTimeout(res, Math.random() * 800));
    return dummyBoards;
}

async function getBoard(id) {
    await new Promise (res => setTimeout(res, Math.random() * 800));
    return dummyLists[id];
}

export async function boardsLoader() {
    const boards = await getBoards();
    return { boards: boards };
}

export async function boardLoader({params}) {
    const board = await getBoard(params.boardId);
    return { board };
}