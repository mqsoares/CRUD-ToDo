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

function update(id: UUID, partialTodo: Partial<Todo>) {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo)=> {
        const isToUpdate = currentTodo.id === id;
        if(isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    })
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 2));    
    if(!updatedTodo) {
        throw new Error('Please, provide another ID!');
    }
    return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
    return update(id, {content})
}

function deleteById(id: UUID) {
    const todos = read();
    const todosWithoutOne = todos.filter((el) => {
        if(el.id === id) {
            return false;
        }
        return true;
    })
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos: todosWithoutOne
    }, null, 2))
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "")
}

// SIMULATION 

CLEAR_DB()
create('Primeiro teste!!!');
const segundoPost = create('Segundo teste, esse é o que vai ser apagado!!!');
const terceiroPost = create('Terceiro teste!!!');

updateContentById(terceiroPost.id, "Atualizada pelo updateContentById")

deleteById(segundoPost.id)

console.log(read())