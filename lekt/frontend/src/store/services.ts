import axios, { AxiosResponse, AxiosError } from "axios";
import { TodoState, Todo, CreateAccountData } from "@src/types";
import { LoginData } from "../types";
import { flatten } from "lodash";

const todosBaseUrl = "/api/todos/";

export function addTodo(data: Todo) {
  return axios
    .post(todosBaseUrl, data)
    .then((response: AxiosResponse<Todo>) => {
      return { data: response.data };
    })
    .catch((error: AxiosError<Record<string, string[]>>) => {
      if (error.response) {
        const serverErrors = flatten(Object.values(error.response.data));
        return { errors: serverErrors };
      } else {
        return { errors: ["Request failed"] };
      }
    });
}

export function removeTodo(requestData: string) {
  return axios
    .delete(`${todosBaseUrl}${requestData}/`)
    .then((response: AxiosResponse<Todo>) => {
      return response.data;
    });
}

export function fetchTodos() {
  return axios.get(todosBaseUrl).then((response: AxiosResponse<Todo[]>) => {
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
  return axios.post("/auth/registration/", accountData).then(response => response.data);
}
