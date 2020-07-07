import { createReducer, RootAction, getType } from "typesafe-actions";
import { combineReducers } from "redux";
import {
  TodoState,
  UserState,
  TodoDisplayState,
  LoginDisplayState,
  CreateAccountDisplayState
} from "@src/types";
import { addTodo, removeTodo, fetchTodos, login, logout, createAccount } from "./actions";

const todoReducer = createReducer<TodoState, RootAction>([])
  .handleAction(addTodo.success, (state, action) => [...state, action.payload])
  .handleAction(removeTodo.success, (state, action) => {
    return [...state.filter(todo => todo.id !== action.payload)];
  })
  .handleAction(fetchTodos.success, (state, action) => action.payload)
  .handleAction(logout.success, (state, action) => []);

const todoDisplayReducer = createReducer<TodoDisplayState, RootAction>({
  isFetching: false
})
  .handleAction([addTodo.request, addTodo.success, addTodo.failure], (state, action) => {
    return { isFetching: action.type === getType(addTodo.request) };
  })
  .handleAction(
    [removeTodo.request, removeTodo.success, removeTodo.failure],
    (state, action) => {
      return { isFetching: action.type === getType(removeTodo.request) };
    }
  )
  .handleAction(
    [fetchTodos.request, fetchTodos.success, fetchTodos.failure],
    (state, action) => {
      return { isFetching: action.type === getType(fetchTodos.request) };
    }
  );

const loginDisplayReducer = createReducer<LoginDisplayState, RootAction>({
  serverErrors: [],
  isFetching: false
})
  .handleAction(login.request, (state, action) => ({
    serverErrors: [],
    isFetching: true
  }))
  .handleAction(login.failure, (state, action) => ({
    serverErrors: action.payload,
    isFetching: false
  }))
  .handleAction(login.success, (state, action) => ({
    serverErrors: [],
    isFetching: false
  }));
const createAccountDisplayReducer = createReducer<CreateAccountDisplayState, RootAction>({
  serverErrors: [],
  isFetching: false
})
  .handleAction(createAccount.request, (state, action) => ({
    serverErrors: [],
    isFetching: true
  }))
  .handleAction(createAccount.failure, (state, action) => ({
    serverErrors: action.payload,
    isFetching: false
  }))
  .handleAction(createAccount.success, (state, action) => ({
    serverErrors: [],
    isFetching: false
  }));

const displayReducer = combineReducers({
  todos: todoDisplayReducer,
  login: loginDisplayReducer,
  account: createAccountDisplayReducer
});

const authReducer = createReducer<UserState, RootAction>({
  loggedIn: false
})
  .handleAction(login.success, (state, action) => ({
    user: action.payload.user,
    key: action.payload.key,
    loggedIn: true,
  }))
  .handleAction(logout.success, (state, action) => ({ loggedIn: false }));

export default combineReducers({
  todos: todoReducer,
  display: displayReducer,
  auth: authReducer
});
