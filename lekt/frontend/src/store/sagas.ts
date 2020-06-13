import { fork, all, takeEvery, put, delay } from "redux-saga/effects";
import { addTodo, removeTodo, fetchTodos } from "./actions";
import {TodoState} from '@src/types';

let nextId = 10;
function* addTodoSaga(action: ReturnType<typeof addTodo.request>) {
  try {
    yield delay(500);
    let id = nextId++;
    yield put(addTodo.success({ ...action.payload, id }));
  } catch (error) {
    yield put(addTodo.failure(`addTodo failed ${error}`));
  }
}

function* removeTodoSaga(action: ReturnType<typeof removeTodo.request>) {
  try {
    yield delay(500);
    yield put(removeTodo.success(action.payload));
  } catch (error) {
    yield put(removeTodo.failure(`removeTodo failed ${error}`));
  }
}

function* fetchTodosSaga(action: ReturnType<typeof fetchTodos.request>) {
  try {
    yield delay(500);
    const initialTodos : TodoState= [
      { id: 0, text: "hello world", author: "psacawa" },
      { id: 1, text: "make lekt", author: "psacawa" },
    ];
    yield put(fetchTodos.success(initialTodos));
  } catch (error) {
    yield put(fetchTodos.failure(`fetchTodo failed ${error}`));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(addTodo.request, addTodoSaga),
    takeEvery(removeTodo.request, removeTodoSaga),
    takeEvery(fetchTodos.request, fetchTodosSaga),
  ]);
  // make initial fetch request
  yield put (fetchTodos.request ())
}
