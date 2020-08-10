import axios, { AxiosResponse, AxiosError } from "axios";
import { TodoState, Todo, CreateAccountData, AuthData } from "@src/types";
import { LoginData } from "types";
import { flatten } from "lodash";

const todosBaseUrl = "/api/todos/";

function appendApiPromiseChain<
  R extends any,
  T extends AxiosResponse<R> = AxiosResponse<R>
>(axiosPromise: Promise<T>) {
  return axiosPromise
    .then(response => {
      return { data: response.data };
    })
    .catch((error: AxiosError<Record<string, string | string[]> | "">) => {
      if (error.response) {
        const serverErrors = flatten(Object.values(error.response.data));
        return { errors: serverErrors };
      } else {
        return { errors: ["Request failed"] };
      }
    });
}

export function addTodo(data: Todo) {
  return appendApiPromiseChain<Todo>(axios.post(todosBaseUrl, data));
}

export function removeTodo(requestData: string) {
  return appendApiPromiseChain<null>(axios.delete(`${todosBaseUrl}${requestData}/`));
}

export function fetchTodos() {
  return appendApiPromiseChain<Todo[]>(axios.get(todosBaseUrl));
}

export function login(loginData: LoginData) {
  return appendApiPromiseChain<AuthData>(axios.post("/auth/login/", loginData))
}

export function logout() {
  return axios.post("/auth/logout/")
}

export function fetchUser() {
  return axios.get("/auth/user/").then(response => response.data);
}

export function createAccount(accountData: CreateAccountData) {
  return axios.post("/auth/registration/", accountData).then(response => response.data);
}
