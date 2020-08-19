import axios, { AxiosResponse, AxiosError } from "axios";
import { TodoState, Todo, CreateAccountData, AuthData } from "@src/types";
import { LoginData } from "types";
import { flatten } from "lodash";
import { BaseError } from "lib/error";

export class ServerError extends BaseError {
  constructor() {
    super("Server Error");
  }
}

interface ClientErrorPayload {
  detail: string;
}
export class ClientError extends BaseError {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isClientError(data: any): data is ClientErrorPayload {
  return typeof data?.detail === "string";
}

type ServerValidationError<V> = NonNullable<{
  non_field_errors?: string[];
}> &
  { [T in keyof V]: string[] };

export class ValidationError<V> extends Error {
  validationErrors: ServerValidationError<V>;
  constructor(errors: ServerValidationError<V>) {
    super();
    this.name = "ValidationError";
    this.message = "Validation Error";
    this.validationErrors = errors;
  }
}

export function isValidationError<V>(error: any): error is ValidationError<V> {
  return error instanceof ValidationError;
}

async function appendApiPromiseChain<
  R extends any,
  FV extends Record<string, any> = Record<string, any>,
  T extends AxiosResponse<R> = AxiosResponse<R>
>(axiosPromise: Promise<T>) {
  return axiosPromise
    .then(response => {
      return response.data;
    })
    .catch(
      (error: AxiosError<ServerValidationError<FV> | ClientErrorPayload | string>) => {
        if (!error.response) {
          throw new Error("Internal Error");
        } else if (error.response.status >= 500) {
          throw new ServerError();
        } else {
          const { data, status } = error.response;
          if (typeof data === "string") {
            throw new ClientError(status, data);
          } else if (isClientError(data)) {
            throw new ClientError(status, data.detail);
          } else {
            throw new ValidationError<FV>(data);
          }
        }
      }
    );
}

const todosBaseUrl = "/api/todos/";

export function addTodo(data: Todo) {
  return appendApiPromiseChain<Todo, { text: string }>(axios.post(todosBaseUrl, data));
}

export function removeTodo(requestData: string) {
  return appendApiPromiseChain<undefined>(axios.delete(`${todosBaseUrl}${requestData}/`));
}

export function fetchTodos() {
  return appendApiPromiseChain<Todo[]>(axios.get(todosBaseUrl));
}

export function login(loginData: LoginData) {
  return appendApiPromiseChain<AuthData>(axios.post("/auth/login/", loginData));
}

export function logout() {
  return appendApiPromiseChain(axios.post("/auth/logout/"));
}

export function fetchUser() {
  return axios.get("/auth/user/").then(response => response.data);
}

export function createAccount(accountData: CreateAccountData) {
  return axios.post("/auth/registration/", accountData).then(response => response.data);
}
