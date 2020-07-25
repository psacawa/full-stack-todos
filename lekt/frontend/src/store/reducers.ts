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
  CommitAction,
  OfflineMeta,
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
      const todo = action.payload.data;
      state[todo.id] = { value: todo, isSubmitting: false };
      delete state[action.meta.id];
    })
    .addCase(addTodo.failure, (state, action) => {
      delete state[action.meta.id];
    })
    .addCase(removeTodo.request, (state, action) => {
      state[action.payload].isSubmitting = true;
    })
    .addCase(removeTodo.success, (state, action) => {
      delete state[action.meta.id];
    })
    .addCase(removeTodo.failure, (state, action) => {
      state[action.meta.id].isSubmitting = false;
    })
    .addCase(fetchTodos.success, (state, action) => {
      const todos = action.payload.data;
      return fromPairs(
        todos.map(todo => [todo.id, { value: todo, isSubmitting: false }])
      );
    })
);

// const todoDisplayReducer = createReducer<TodoDisplayState>({
//   isFetching: false
// })
//   .handleAction([addTodo.request, addTodo.success, addTodo.failure], (state, action) => {
//     return { isFetching: action.type === getType(addTodo.request) };
//   })
//   .handleAction(
//     [removeTodo.request, removeTodo.success, removeTodo.failure],
//     (state, action) => {
//       return { isFetching: action.type === getType(removeTodo.request) };
//     }
//   )
//   .handleAction(
//     [fetchTodos.request, fetchTodos.success, fetchTodos.failure],
//     (state, action) => {
//       return { isFetching: action.type === getType(fetchTodos.request) };
//     }
//   );

const loginDisplayReducer = createReducer<LoginDisplayState>(
  {
    serverErrors: [],
    isFetching: false
  },
  builder =>
    builder
      .addCase(login.request as any, (state, action) => ({
        serverErrors: [],
        isFetching: true
      }))
      .addCase(login.failure as any, (state, action) => ({
        serverErrors: action.payload,
        isFetching: false
      }))
      .addCase(login.success as any, (state, action) => ({
        serverErrors: [],
        isFetching: false
      }))
);
// const createAccountDisplayReducer = createReducer<CreateAccountDisplayState>({
//   serverErrors: [],
//   isFetching: false
// })
//   .handleAction(createAccount.request, (state, action) => ({
//     serverErrors: [],
//     isFetching: true
//   }))
//   .handleAction(createAccount.failure, (state, action) => ({
//     serverErrors: action.payload,
//     isFetching: false
//   }))
//   .handleAction(createAccount.success, (state, action) => ({
//     serverErrors: [],
//     isFetching: false
//   }));

const displayReducer = combineReducers({
  // todos: todoDisplayReducer,
  login: loginDisplayReducer
  // account: createAccountDisplayReducer
});

const authReducer = createReducer<UserState>(
  {
    loggedIn: false
  },
  builder =>
    builder
      .addCase(login.success as any, (state, action) => ({
        user: action.payload.user,
        key: action.payload.key,
        loggedIn: true
      }))
      .addCase(logout.success as any, (state, action) => ({ loggedIn: false }))
);

export default combineReducers({
  todos: todoReducer,
  auth: authReducer,
  display: displayReducer
});
