import { createAsyncAction } from "typesafe-actions";
import { Todo, TodoData, User } from "@src/types";
import { CreateAccountData, LoginData } from "../types";
import { FormikHelpers } from "formik";

export const addTodo = createAsyncAction(
  "ADD_TODO_REQUEST",
  "ADD_TODO_SUCCESS",
  "ADD_TODO_FAILURE"
)<TodoData, Todo, string>();

export const removeTodo = createAsyncAction(
  "REMOVE_TODO_REQUEST",
  "REMOVE_TODO_SUCCESS",
  "REMOVE_TODO_FAILURE"
)<number, number, string>();

export const fetchTodos = createAsyncAction(
  "FETCH_TODO_REQUEST",
  "FETCH_TODO_SUCCESS",
  "FETCH_TODO_FAILURE"
)<undefined, Todo[], string>();

export const createAccount = createAsyncAction(
  "CREATE_ACCOUNT_REQUEST",
  "CREATE_ACCOUNT_SUCCESS",
  "CREATE_ACCOUNT_FAILURE"
)<[CreateAccountData, FormikHelpers <any>], undefined, string[]>();

export const login = createAsyncAction(
  "LOGIN_REQUEST", 
  "LOGIN_SUCCESS", 
  "LOGIN_FAILURE"
)< LoginData, User, string[]>();

export const logout = createAsyncAction(
  "LOGOUT_REQUEST",
  "LOGOUT_SUCCESS",
  "LOGOUT_FAILURE"
)<undefined, undefined, string>();

export const todoAction = { addTodo, removeTodo, fetchTodos };
export const accountAction = { login, logout, createAccount };
export default { todoAction, accountAction };
