import { createStore, applyMiddleware, compose, StoreEnhancer, Middleware } from "redux";
import createSaga from "redux-saga";
import rootReducer from "./reducers";
import { createLogger } from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import rootSaga from "./sagas";
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import { Action } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistConfig } from "redux-persist/es/types";
import { getAuthKey } from "./selectors";
import { RootState } from "@src/types";
import { fetchTodos } from "./actions";

const persistOptions: PersistConfig<RootState> = {
  key: "root",
  version: 1,
  storage
};
const persistCallback = () => {
  const key = getAuthKey(store.getState());
  if (key) {
    axios.defaults.headers["Authorization"] = `Token ${key}`;
  }
};

const logger = createLogger();
const saga = createSaga();
const persistedReducer = persistReducer(persistOptions, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger, saga),
  enhancers: defaultEnhancers => [...defaultEnhancers]
});
export const persistor = persistStore(store, undefined, persistCallback);
saga.run(rootSaga);

// on starting the application, sync data if online
if (window.navigator.onLine) {
  store.dispatch(fetchTodos.request())
}

export default store;
