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
    return fetch(`api/todos?page=${page}&limit=${limit}`).then(
        async (resSever) => {
            const todosString = await resSever.text();
            const responseParsed = parseTodosFromSever(JSON.parse(todosString));

            // const ALL_TODOS = todosFromServer;
            // const startIndex = (page - 1) * limit;
            // const endIndex = page * limit;
            // const paginatedTodo = ALL_TODOS.slice(startIndex, endIndex);
            // const totalPages = Math.ceil(ALL_TODOS.length / limit);

            return {
                todos: responseParsed.todos,
                total: responseParsed.total,
                pages: responseParsed.pages,
            };
        }
    );
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

function parseTodosFromSever(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Array<Todo>;
} {
    // console.log(Array.isArray(responseBody.todos));
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
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
        pages: 1,
        total: 0,
        todos: [],
    };
}
