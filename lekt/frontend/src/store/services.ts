import axios, { AxiosResponse } from "axios";
import { TodoState, TodoData, Todo } from "@src/types";

const todosBaseUrl = "/api/todos/";

export function addTodo(requestData: TodoData) {
  return axios
    .post(todosBaseUrl, requestData)
    .then((response: AxiosResponse<Todo>) => {
      return response.data;
    })
}

export function removeTodo(requestData: number ) {
  return axios
    .delete(`${todosBaseUrl}/${requestData}`)
    .then((response: AxiosResponse<Todo>) => {
      return response.data;
    })
}

export function fetchTodos() {
  return axios
    .get(todosBaseUrl)
    .then((response: AxiosResponse<TodoState>) => {
      return response.data;
    })
}
