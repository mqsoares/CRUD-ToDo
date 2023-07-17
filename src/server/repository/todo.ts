import { read } from "@db-crud-todo";

interface todoRepositoryGetParams {
    page?: number;
    limit?: number;
}

interface todoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function get({ page, limit }: todoRepositoryGetParams = {}) {
    const currentPage = page || 1;
    const currentLimit = limit || 10;

    const ALL_TODOS = read();

    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = currentPage * currentLimit;
    const paginatedTodo = ALL_TODOS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

    return {
        todos: paginatedTodo,
        total: ALL_TODOS.length,
        pages: totalPages,
    };
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
