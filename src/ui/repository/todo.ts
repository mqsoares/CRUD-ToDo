interface todoRepositoryGetParams {
    page: number;
    limit: number;
}
interface todoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function get({
    page,
    limit,
}: todoRepositoryGetParams): Promise<todoRepositoryGetOutput> {
    return fetch("api/todos").then(async (resSever) => {
        const todosString = await resSever.text();
        const todosFromServer = JSON.parse(todosString).todos;

        const ALL_TODOS = todosFromServer;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTodo = ALL_TODOS.slice(startIndex, endIndex);
        const totalPages = Math.ceil(ALL_TODOS.length / limit);

        return {
            todos: ALL_TODOS,
            total: ALL_TODOS.length,
            pages: 1,
        };
    });
}

export const todoRepository = {
    get,
};

interface Todo {
    id: string;
    content: string;
    date: Date;
    done: boolean;
}
