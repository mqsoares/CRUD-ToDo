async function get() {
    return fetch("api/todos").then(async (resSever) => {
        const todosString = await resSever.text();
        const todosFromServer = JSON.parse(todosString).todos;
        return todosFromServer;
    });
}

export const todoController = {
    get,
};
