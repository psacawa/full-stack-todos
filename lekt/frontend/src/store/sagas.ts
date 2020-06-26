import { call, all, takeEvery, put, take, fork, cancel } from "redux-saga/effects";
import { Task } from "redux-saga";
import { addTodo, removeTodo, fetchTodos, login, logout, createAccount } from "./actions";
import { TodoState, Todo, LoginData, AuthData, User } from "@src/types";
import * as api from "./services";
import axios from "axios";
import { ActionType, getType, RootAction } from "typesafe-actions";

function* addTodoSaga(action: ReturnType<typeof addTodo.request>) {
  try {
    const data: Todo = yield call(api.addTodo, action.payload);
    yield put(addTodo.success(data));
  } catch (error) {
    yield put(addTodo.failure(`addTodo failed ${error}`));
  }
}

function* removeTodoSaga(action: ReturnType<typeof removeTodo.request>) {
  try {
    yield call(api.removeTodo, action.payload);
    yield put(removeTodo.success(action.payload));
  } catch (error) {
    yield put(removeTodo.failure(`removeTodo failed ${error}`));
  }
}

function* fetchTodosSaga(action: ReturnType<typeof fetchTodos.request>) {
  try {
    const data: TodoState = yield call(api.fetchTodos);
    yield put(fetchTodos.success(data));
  } catch (error) {
    yield put(fetchTodos.failure(`fetchTodo failed ${error}`));
  }
}

function* loginFlow() {
  while (true) {
    const loginAction: ActionType<typeof login.request> = yield take(login.request);
    const task: Task = yield fork(authenticate, loginAction.payload);
    const logoutAction: RootAction = yield take([logout.success, login.failure]);
    if (logoutAction.type === getType(logout.request)) {
      yield cancel(task);
    }
    localStorage.removeItem("key");
    delete axios.defaults.headers.common["Authorization"];
  }
}

function* authenticate(values: LoginData) {
  try {
    const authData: AuthData = yield call(api.login, values);
    axios.defaults.headers.common["Authorization"] = `Token ${authData.key}`;
    localStorage.setItem("key", authData.key);
    const user: User = yield call(api.fetchUser);
    yield put(login.success(user));
    yield put(fetchTodos.request());
  } catch (error) {
    yield put(login.failure(error.message));
  }
}

function* logoutFlow() {
  while (true) {
    yield take(logout.request);
    try {
      yield api.logout();
      yield put(logout.success());
    } catch (error) {
      yield logout.failure(error.message);
    }
  }
}

function* createAccountSaga(action: ActionType<typeof createAccount.request>) {
  try {
    const accountData = action.payload;
    yield call(api.createAccount, action.payload);
    yield put(createAccount.success());
    const loginData: LoginData = {
      username: accountData.username,
      password: accountData.password1
    };
    yield put(login.request(loginData));
  } catch (error) {
    yield put(createAccount.failure(error.message));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(addTodo.request, addTodoSaga),
    takeEvery(removeTodo.request, removeTodoSaga),
    takeEvery(fetchTodos.request, fetchTodosSaga),
    takeEvery(createAccount.request, createAccountSaga),
    fork(loginFlow),
    fork(logoutFlow)
  ]);
}
