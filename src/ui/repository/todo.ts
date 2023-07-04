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
        const todosFromServer = parseTodosFromSever(
            JSON.parse(todosString)
        ).todos;

        const ALL_TODOS = todosFromServer;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTodo = ALL_TODOS.slice(startIndex, endIndex);
        const totalPages = Math.ceil(ALL_TODOS.length / limit);

        return {
            todos: paginatedTodo,
            total: ALL_TODOS.length,
            pages: totalPages,
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

function parseTodosFromSever(responseBody: unknown): { todos: Array<Todo> } {
    // console.log(Array.isArray(responseBody.todos));
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== "object") {
                    throw new Error("Invalid todo from API");
                }

                const { id, content, date, done } = todo as {
                    id: string;
                    content: string;
                    date: string;
                    done: string;
                };
                return {
                    id,
                    content,
                    date: new Date(date),
                    done: String(done).toLowerCase() === "true",
                };
            }),
        };
    }
    return {
        todos: [],
    };
}
