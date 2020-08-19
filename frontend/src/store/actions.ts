import { createAction, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { Todo, LoginSuccessPayload, Incomplete, Id, ErrorList } from "@src/types";
import { CreateAccountData, LoginData } from "types";
import { FormikHelpers } from "formik";

export const addTodo = {
  request: createAction("ADD_TODO_REQUEST", (data: Incomplete<Todo>) => {
    const tmpId = nanoid() as Id;
    return {
      payload: { ...data, id: tmpId }
    };
  }),
  success: createAction("ADD_TODO_SUCCESS", (todo: Todo, tmpId: Id) => ({
    payload: { todo, tmpId }
  })),
  failure: createAction("ADD_TODO_FAILURE", (error: ErrorList, tmpId: Id) => ({
    payload: {
      tmpId
    },
    error
  }))
};

export const removeTodo = {
  request: createAction("REMOVE_TODO_REQUEST", (id: Id) => ({ payload: { id } })),
  success: createAction("REMOVE_TODO_SUCCESS", (id: Id) => ({ payload: { id } })),
  failure: createAction("REMOVE_TODO_FAILURE", (id: Id) => ({ payload: { id } }))
};

export const fetchTodos = {
  request: createAction("FETCH_TODO_REQUEST"),
  success: createAction<Todo[], "FETCH_TODO_SUCCESS">("FETCH_TODO_SUCCESS"),
  failure: createAction<ErrorList>("FETCH_TODO_FAILURE")
};

export const createAccount = {
  request: createAction(
    "CREATE_ACCOUNT_REQUEST",
    (data: CreateAccountData, bag: FormikHelpers<any>) => ({
      payload: data,
      meta: bag
    })
  ),
  success: createAction("CREATE_ACCOUNT_SUCCESS"),
  failure: createAction("CREATE_ACCOUNT_FAILURE", (error: ErrorList) => ({
    payload: undefined,
    error
  }))
};

export const login = {
  request: createAction("LOGIN_REQUEST", (data: LoginData, bag?: FormikHelpers<any>) => ({
    payload: data,
    meta: bag
  })),
  success: createAction<LoginSuccessPayload, "LOGIN_SUCCESS">("LOGIN_SUCCESS"),
  failure: createAction<ErrorList, "LOGIN_FAILURE">("LOGIN_FAILURE")
};

export const logout = {
  request: createAction("LOGOUT_REQUEST"),
  success: createAction("LOGOUT_SUCCESS"),
  failure: createAction("LOGOUT_FAILURE")
};
