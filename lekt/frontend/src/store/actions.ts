import { createAsyncAction } from "typesafe-actions";
import { createAction, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { Todo, LoginSuccessPayload, Incomplete, OfflineMeta, Id } from "@src/types";
import { CreateAccountData, LoginData } from "../types";
import { FormikHelpers } from "formik";
import { store } from ".";

export const addTodo = {
  request: createAction(
    "ADD_TODO_REQUEST",
    (
      data: Incomplete<Todo>
    ): Omit<PayloadAction<Todo, string, OfflineMeta<{ id: Id }>>, "type"> => {
      const tmpId = nanoid() as Id;
      const meta = { id: tmpId };
      return {
        payload: { ...data, ...meta },
        meta: {
          offline: {
            effect: { method: "post", url: "/api/todos/", data },
            commit: {
              type: "ADD_TODO_SUCCESS",
              meta
            },
            rollback: {
              type: "ADD_TODO_FAILURE",
              meta
            },
            ...meta
          }
        }
      };
    }
  ),
  success: createAction(
    "ADD_TODO_SUCCESS",
    (a: PayloadAction<AxiosResponse<Todo>, string, { id: Id }>) => a
  ),
  failure: createAction(
    "ADD_TODO_FAILURE",
    (a: PayloadAction<AxiosResponse<Todo>, string, { id: Id }>) => a
  )
};

export const removeTodo = {
  request: createAction(
    "REMOVE_TODO_REQUEST",
    (data: Id): Omit<PayloadAction<string, string, OfflineMeta<{ id: Id }>>, "type"> => {
      const meta = { id: data };
      return {
        payload: data,
        meta: {
          offline: {
            effect: { method: "delete", url: `/api/todos/${data}/` },
            commit: {
              type: "REMOVE_TODO_SUCCESS",
              meta
            },
            rollback: {
              type: "REMOVE_TODO_FAILURE",
              meta
            },
            ...meta
          }
        }
      };
    }
  ),
  success: createAction(
    "REMOVE_TODO_SUCCESS",
    (x: PayloadAction<AxiosResponse<string>, string, { id: Id }>) => x
  ),
  failure: createAction(
    "REMOVE_TODO_FAILURE",
    (x: PayloadAction<AxiosError<string>, string, { id: Id }>) => x
  )
};

export const fetchTodos = {
  request: createAction("FETCH_TODO_REQUEST", () => ({
    payload: null,
    meta: {
      offline: {
        effect: { method: "get", url: "/api/todos/" },
        commit: {
          type: "FETCH_TODO_SUCCESS"
        },
        rollback: {
          type: "FETCH_TODO_FAILURE"
        }
      }
    }
  })),
  success: createAction<AxiosResponse<Todo[]>>("FETCH_TODO_SUCCESS"),
  failure: createAction<AxiosError<string>>("FETCH_TODO_FAILURE")
};

export const createAccount = createAsyncAction(
  "CREATE_ACCOUNT_REQUEST",
  "CREATE_ACCOUNT_SUCCESS",
  "CREATE_ACCOUNT_FAILURE"
)<[CreateAccountData, FormikHelpers<any>], undefined, string[]>();

// export const login = createAsyncAction("LOGIN_REQUEST", "LOGIN_SUCCESS", "LOGIN_FAILURE")<
//   [LoginData, FormikHelpers<any> | undefined],
//   LoginSuccessPayload,
//   string[]
// >();

export const login = {
  request: createAction("LOGIN_REQUEST", (data: LoginData, bag?: FormikHelpers<any>) => ({
    payload: data,
    meta: bag
  })),
  success: createAction<LoginSuccessPayload>("LOGIN_SUCCESS"),
  failure: createAction<string[]>("LOGIN_FAILURE")
};

// export const login = {
//   request: createAction()
// }

export const logout = createAsyncAction(
  "LOGOUT_REQUEST",
  "LOGOUT_SUCCESS",
  "LOGOUT_FAILURE"
)<undefined, undefined, string>();

export const accountAction = { login, logout, createAccount };
export default { accountAction };
