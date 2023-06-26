import fs from "fs";
const DB_FILE_PATH = "./core/db";
import { v4 as uuid } from 'uuid';

console.log("[CRUD]");

type UUID = string

interface Todo {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
}

function create(content: UUID): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    }
    const todos = [
        ...read(),
        todo
    ]
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos
    }, null, 2));
    return todo;
}

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if(!db.todos) {
        return []
    }
    return db.todos;
}


create('Primeiro teste!!!');
create('Segundo teste, esse é o que vai ser apagado!!!');
create('Terceiro teste!!!');

console.log(read())