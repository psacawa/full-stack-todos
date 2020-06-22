import { createReducer, RootAction, getType } from "typesafe-actions";
import { combineReducers } from "redux";
import { TodoState, DisplayState, UserState } from "@src/types";
import { addTodo, removeTodo, fetchTodos, login, logout, fetchUser } from "./actions";

const todoReducer = createReducer<TodoState, RootAction>([])
  .handleAction(addTodo.success, (state, action) => [...state, action.payload])
  .handleAction(removeTodo.success, (state, action) => {
    return [...state.filter(todo => todo.id !== action.payload)];
  })
  .handleAction(fetchTodos.success, (state, action) => action.payload);

const displayReducer = createReducer<DisplayState, RootAction>({
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

const authReducer = createReducer<UserState, RootAction>({
  loggedIn: false
})
  .handleAction(login.success, (state, action) => ({
    ...action.payload,
    loggedIn: true
  }))
  .handleAction(logout.success, (state, action) => ({ loggedIn: false }))
  .handleAction(fetchUser.success, (state, action) => ({
    ...state,
    user: action.payload,
    loggedIn: true
  }));

export default combineReducers({
  todos: todoReducer,
  display: displayReducer,
  auth: authReducer
});
