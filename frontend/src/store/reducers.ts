import {
  combineReducers,
  createReducer,
  createSlice,
  PayloadAction,
  nanoid
} from "@reduxjs/toolkit";
import {
  TodoState,
  UserState,
  TodoDisplayState,
  LoginDisplayState,
  CreateAccountDisplayState,
  Todo,
  Incomplete
} from "@src/types";
import { addTodo, removeTodo, fetchTodos, login, logout, createAccount } from "./actions";
import { AxiosResponse } from "axios";
import { toPairs, fromPairs } from "lodash";

export const todoReducer = createReducer<TodoState>({}, builder =>
  builder
    .addCase(addTodo.request, (state, action) => {
      const { id } = action.payload;
      state[id] = { value: action.payload, isSubmitting: true };
    })
    .addCase(addTodo.success, (state, action) => {
      const { todo, tmpId } = action.payload;
      state[todo.id] = { value: todo, isSubmitting: false };
      delete state[tmpId];
    })
    .addCase(addTodo.failure, (state, action) => {
      delete state[action.payload.tmpId];
    })
    .addCase(removeTodo.request, (state, action) => {
      state[action.payload.id].isSubmitting = true;
    })
    .addCase(removeTodo.success, (state, action) => {
      delete state[action.payload.id];
    })
    .addCase(removeTodo.failure, (state, action) => {
      state[action.payload.id].isSubmitting = false;
    })
    .addCase(fetchTodos.success, (state, action) => {
      const todos = action.payload;
      return fromPairs(
        todos.map(todo => [todo.id, { value: todo, isSubmitting: false }])
      );
    })
    .addCase(logout.success, (state, action) => {
      return {};
    })
);

const loginDisplayReducer = createReducer<LoginDisplayState>(
  {
    serverErrors: [],
    isFetching: false
  },
  builder =>
    builder
      .addCase(login.request, (state, action) => ({
        serverErrors: [],
        isFetching: true
      }))
      .addCase(login.failure, (state, action) => ({
        serverErrors: action.payload,
        isFetching: false
      }))
      .addCase(login.success, (state, action) => ({
        serverErrors: [],
        isFetching: false
      }))
);
const createAccountDisplayReducer = createReducer<CreateAccountDisplayState>(
  {
    serverErrors: [],
    isFetching: false
  },
  builder =>
    builder
      .addCase(createAccount.request, (state, action) => ({
        serverErrors: [],
        isFetching: true
      }))
      .addCase(createAccount.success, (state, action) => ({
        serverErrors: [],
        isFetching: false
      }))
      .addCase(createAccount.failure, (state, action) => ({
        serverErrors: [],
        isFetching: false
      }))
);

const displayReducer = combineReducers({
  login: loginDisplayReducer,
  account: createAccountDisplayReducer
});

const authReducer = createReducer<UserState>(
  {
    loggedIn: false
  },
  builder =>
    builder
      .addCase(login.success, (state, action) => ({
        user: action.payload.user,
        key: action.payload.key,
        loggedIn: true
      }))
      .addCase(logout.request, (state, action) => ({ loggedIn: false }))
);

export default combineReducers({
  todos: todoReducer,
  auth: authReducer,
  display: displayReducer
});
