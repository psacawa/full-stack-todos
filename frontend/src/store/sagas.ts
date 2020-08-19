import { all, takeEvery, put, cancel, delay } from "redux-saga/effects";
import { call, take, fork } from "typed-redux-saga";
import { takeCreator } from "lib/typed-saga-effects";
import { Task } from "redux-saga";
import { addTodo, removeTodo, fetchTodos, login, logout, createAccount } from "./actions";
import { history } from "routes";

import {
  TodoState,
  Todo,
  LoginData,
  AuthData,
  User,
  CreateAccountData,
  ErrorList
} from "@src/types";
import * as api from "./services";
import axios from "axios";
import { flatten } from "lodash";
import { FormikHelpers } from "formik";

function* addTodoSaga(action: ReturnType<typeof addTodo.request>) {
  const tmpId = action.payload.id;
  try {
    const data = yield* call(api.addTodo, action.payload);
    yield put(addTodo.success(data, tmpId));
  } catch (error) {
    if (api.isValidationError<Todo>(error)) {
      const { validationErrors } = error;
      const errorList: string[] = flatten(Object.values(validationErrors));
      yield put(addTodo.failure(errorList, tmpId));
    } else if (error instanceof Error) {
      yield put(addTodo.failure([error.message], tmpId));
    }
  }
}

function* removeTodoSaga(action: ReturnType<typeof removeTodo.request>) {
  const id = action.payload.id;
  try {
    yield* call(api.removeTodo, id);
    yield put(removeTodo.success(action.payload.id));
  } catch (error) {
    if (error instanceof Error) {
      yield put(removeTodo.failure(action.payload.id));
    }
  }
}

function* fetchTodosSaga(action: ReturnType<typeof fetchTodos.request>) {
  try {
    const todos = yield* call(api.fetchTodos);
    yield put(fetchTodos.success(todos));
  } catch (error) {
    if (error instanceof Error) {
      yield put(fetchTodos.failure([error.name]));
    }
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
  try {
    const { key } = yield* call(api.login, values);
    axios.defaults.headers.common["Authorization"] = `Token ${key}`;
    const user: User = yield* call(api.fetchUser);
    yield put(login.success({ user, key }));
    yield put(fetchTodos.request());
  } catch (error) {
    yield delay(500);
    if (error instanceof api.ValidationError) {
      const errorList = flatten(Object.values(error.validationErrors));
      yield put(login.failure(errorList));
    } else {
      yield put(login.failure(["Login Failed"]));
    }
    bag && bag.setSubmitting(false);
  }
}

function* logoutSaga() {
  try {
    delete axios.defaults.headers.common["Authorization"];
    yield call(api.logout);
    yield put(logout.success());
  } catch (error) {
    yield put(logout.failure());
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
    takeEvery(logout.request, logoutSaga)
  ]);
}
