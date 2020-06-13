import { createAsyncAction } from "typesafe-actions";
import { Todo, TodoData } from "@src/types";

export const addTodo = createAsyncAction(
  "ADD_TODO_REQUEST",
  "ADD_TODO_SUCCESS",
  "ADD_TODO_REQUEST"
)<TodoData, Todo, string>();

export const removeTodo = createAsyncAction(
  "REMOVE_TODO_REQUEST",
  "REMOVE_TODO_SUCCESS",
  "REMOVE_TODO_REQUEST"
)<number, number, string>();

export const fetchTodos = createAsyncAction(
  "FETCH_TODO_REQUEST",
  "FETCH_TODO_SUCCESS",
  "FETCH_TODO_REQUEST"
)<undefined, Todo[], string>();

export const todoAction = { addTodo, removeTodo, fetchTodos };
export default todoAction;
