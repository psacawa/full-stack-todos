import { call, all, takeEvery, put, take, fork, cancel, delay } from "redux-saga/effects";
import { Task } from "redux-saga";
import { addTodo, removeTodo, fetchTodos, login, logout, createAccount } from "./actions";
import {
  TodoState,
  Todo,
  LoginData,
  AuthData,
  User,
  CreateAccountData
} from "@src/types";
import * as api from "./services";
import axios from "axios";
import { ActionType, getType, RootAction } from "typesafe-actions";
import { flatten } from "lodash";
import { FormikHelpers } from "formik";

function* addTodoSaga(action: ReturnType<typeof addTodo.request>) {
  const { setSubmitting, resetForm } = action.meta;
  try {
    const data: Todo = yield call(api.addTodo, action.payload);
    yield put(addTodo.success(data));
  } catch (error) {
    yield put(addTodo.failure(`addTodo failed ${error}`));
  } finally {
    setSubmitting(false);
    resetForm();
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
    const task: Task = yield fork(authenticate, loginAction.payload, loginAction.meta);
    const logoutAction: RootAction = yield take([logout.success, login.failure]);
    if (logoutAction.type === getType(logout.request)) {
      yield cancel(task);
    }
  }
}

function* authenticate(values: LoginData, bag?: FormikHelpers<any>) {
  try {
    const authData: AuthData = yield call(api.login, values);
    const { key } = authData;
    axios.defaults.headers.common["Authorization"] = `Token ${key}`;
    const user: User = yield call(api.fetchUser);
    yield put(login.success({ user, key }));
    yield put(fetchTodos.request());
  } catch (error) {
    const serverErrors: string[] = flatten(Object.values(error.response.data));
    yield delay(500);
    yield put(login.failure(serverErrors));
    if (bag) {
      bag.setSubmitting(false);
    }
  }
}

function* logoutFlow() {
  while (true) {
    yield take(logout.request);
    try {
      yield api.logout();
      yield put(logout.success());
    } catch (error) {
      yield put(logout.failure(error.message));
    } finally {
      delete axios.defaults.headers.common["Authorization"];
    }
  }
}

function* createAccountSaga(action: ActionType<typeof createAccount.request>) {
  const accountData = action.payload;
  const { setSubmitting } = action.meta;
  const loginData: LoginData = {
    username: accountData.username,
    password: accountData.password1
  };
  try {
    // setSubmitting(true)
    yield delay(1000);
    yield call(api.createAccount, action.payload);
    yield put(createAccount.success());
    yield put(login.request(loginData, undefined));
  } catch (error) {
    const errors: Record<keyof CreateAccountData, string[]> = error.response.data;
    const serverErrors = flatten(Object.values(errors));
    console.error(serverErrors);
    yield put(createAccount.failure(serverErrors));
  } finally {
    setSubmitting(false);
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
