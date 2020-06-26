import axios, { AxiosResponse } from "axios";
import { TodoState, TodoData, Todo, CreateAccountData } from "@src/types";
import { LoginData } from "../types";

const todosBaseUrl = "/api/todos/";

export function addTodo(requestData: TodoData) {
  return axios.post(todosBaseUrl, requestData).then((response: AxiosResponse<Todo>) => {
    return response.data;
  })
}

export function removeTodo(requestData: number) {
  return axios
    .delete(`${todosBaseUrl}${requestData}/`)
    .then((response: AxiosResponse<Todo>) => {
      return response.data;
    });
}

export function fetchTodos() {
  return axios.get(todosBaseUrl)
    .then((response: AxiosResponse<TodoState>) => {
      return response.data;
    });
}

export function login(loginData: LoginData) {
  return axios.post("/auth/login/", loginData).then(response => response.data);
}

export function logout() {
  return axios.post("/auth/logout/").then(response => response.data);
}

export function fetchUser() {
  return axios.get("/auth/user/").then(response => response.data);
}

export function createAccount(accountData: CreateAccountData) {
  return axios.post ('/auth/registration', accountData).then (response => response.data)
}
