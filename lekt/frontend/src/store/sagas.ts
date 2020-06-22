import { call, all, takeEvery, put, delay } from "redux-saga/effects";
import { addTodo, removeTodo, fetchTodos, login, logout, fetchUser } from "./actions";
import { TodoState, Todo, LoginFormValues, AuthData, User } from "@src/types";
import * as api from './services';
import axios, { AxiosError } from "axios";


function* addTodoSaga(action: ReturnType<typeof addTodo.request>) {
  try {
    const data : Todo = yield call (api.addTodo, action.payload)
    yield put(addTodo.success(data));
  } catch (error) {
    yield put(addTodo.failure(`addTodo failed ${error}`));
  }
}

function* removeTodoSaga(action: ReturnType<typeof removeTodo.request>) {
  try {
    yield call (api.removeTodo, action.payload )
    yield put(removeTodo.success(action.payload));
  } catch (error) {
    yield put(removeTodo.failure(`removeTodo failed ${error}`));
  }
}

function* fetchTodosSaga(action: ReturnType<typeof fetchTodos.request>) {
  try {
    const data: TodoState = yield call (api.fetchTodos)
    yield put (fetchTodos.success (data))
  } catch (error) {
    yield put(fetchTodos.failure(`fetchTodo failed ${error}`));
  }
}

function* fetchUserSaga(action: ReturnType<typeof fetchUser.request>) {
  try {
    const data: User = yield call (api.fetchUser)
    yield put (fetchUser.success (data))
  } catch (error) {
    yield put(fetchUser.failure(`fetchUser failed ${error}`));
  }
}

function* loginSaga(action: ReturnType<typeof login.request>) {
  try {
    const data: any = yield call (api.login, action.payload)
    const authData: AuthData = { key: data.key }
    axios.defaults.headers.common['Authorization'] = authData.key
    const userData: User = yield put (fetchUser.request()) 
    yield put (fetchTodos.request()) 
    yield put (login.success(authData))
  } catch (error) {
    const data: LoginFormValues = error.response.data 
    yield put (login.failure (data))
  }
}

function* logoutSaga(action: ReturnType<typeof logout.request>) {
  try {
    const data: User = yield call (api.logout)
    yield put (logout.success ())
  } catch (error) {
    yield put(logout.failure(`logout failed ${error}`));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(addTodo.request, addTodoSaga),
    takeEvery(removeTodo.request, removeTodoSaga),
    takeEvery(fetchTodos.request, fetchTodosSaga),
    takeEvery(fetchUser.request, fetchUserSaga),
    takeEvery(login.request, loginSaga),
    takeEvery(logout.request, logoutSaga),
  ]);
  // make initial fetch request
  yield put(fetchTodos.request());
}
