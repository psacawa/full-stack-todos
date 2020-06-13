import { call, all, takeEvery, put, delay } from "redux-saga/effects";
import { addTodo, removeTodo, fetchTodos } from "./actions";
import { TodoState, Todo } from "@src/types";
import * as api from './services';


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

export default function* rootSaga() {
  yield all([
    takeEvery(addTodo.request, addTodoSaga),
    takeEvery(removeTodo.request, removeTodoSaga),
    takeEvery(fetchTodos.request, fetchTodosSaga)
  ]);
  // make initial fetch request
  yield put(fetchTodos.request());
}
