import { all, takeEvery, put, cancel, delay } from "redux-saga/effects";
import { call, take, fork } from "typed-redux-saga";
import { takeCreator } from "lib/typed-saga-effects";
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
import { flatten } from "lodash";
import { FormikHelpers } from "formik";

// type predicate util which allows typesafe check of result status
function succeeded<T, E>(arg: { data: T } | { errors: E }): arg is { data: T } {
  return "data" in arg;
}

function* addTodoSaga(action: ReturnType<typeof addTodo.request>) {
  const tmpId = action.payload.id;
  const result = yield* call(api.addTodo, action.payload);
  if (succeeded(result)) {
    yield put(addTodo.success(result.data, tmpId));
  } else {
    yield put(addTodo.failure(result.errors, tmpId));
  }
}

function* removeTodoSaga(action: ReturnType<typeof removeTodo.request>) {
  const id = action.payload.id;
  const result = yield* call(api.removeTodo, id);
  if (succeeded(result)) {
    yield put(removeTodo.success(action.payload.id));
  } else {
    yield put(removeTodo.failure(action.payload.id));
  }
}

function* fetchTodosSaga(action: ReturnType<typeof fetchTodos.request>) {
  const result = yield* call(api.fetchTodos);
  if (succeeded(result)) {
    yield put(fetchTodos.success(result.data));
  } else {
    yield put(fetchTodos.failure());
  }
}

function* loginFlow() {
  while (true) {
    const loginAction = yield* takeCreator(login.request);
    const task = yield* fork(authenticate, loginAction.payload, loginAction.meta);
    const logoutAction = yield* takeCreator([logout.request, login.failure]);
    if (logoutAction.type === logout.request.type) {
      yield cancel(task);
    }
  }
}

function* authenticate(values: LoginData, bag?: FormikHelpers<any>) {
  bag && bag.setSubmitting(true);
  const result = yield* call(api.login, values);
  if (succeeded(result)) {
    const { key } = result.data;
    axios.defaults.headers.common["Authorization"] = `Token ${key}`;
    const user: User = yield* call(api.fetchUser);
    yield put(login.success({ user, key }));
    yield put(fetchTodos.request());
    bag && bag.resetForm();
  } else {
    yield delay(500);
    yield put(login.failure(result.errors));
    bag && bag.setSubmitting(false);
  }
}

function* logoutFlow() {
  while (true) {
    yield take(logout.request);
    const result = yield* call(api.logout);
    if (succeeded(result)) {
      yield put(logout.success());
    } else {
      // this does nothing
      yield put(logout.failure());
    }
    delete axios.defaults.headers.common["Authorization"];
  }
}

function* createAccountSaga(action: ReturnType<typeof createAccount.request>) {
  const accountData = action.payload;
  const { setSubmitting } = action.meta;
  const loginData: LoginData = {
    email: accountData.email,
    password: accountData.password1
  };
  try {
    // setSubmitting(true)
    yield delay(1000);
    yield* call(api.createAccount, action.payload);
    yield put(createAccount.success());
    // yield put(login.request(loginData, undefined));
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
