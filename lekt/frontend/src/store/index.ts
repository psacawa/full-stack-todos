import { createStore, applyMiddleware, compose, StoreEnhancer, Middleware } from "redux";
import createSaga from "redux-saga";
import rootReducer from "./reducers";
import { createLogger } from "redux-logger";
import { createOffline } from "@redux-offline/redux-offline";
import offlineDefault from "@redux-offline/redux-offline/lib/defaults";
import { configureStore } from "@reduxjs/toolkit";
import rootSaga from "./sagas";
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import { Action } from "redux";
import { OfflineAction } from "@redux-offline/redux-offline/lib/types";
import { fetchTodos } from "./actions";

const persistOptions = {
  keyPrefix: "root"
};
const persistCallback = () => {
  const key = store.getState().auth.key;
  if (key) {
    axios.defaults.headers["Authorization"] = `Token ${key}`;
  }
};

const offlineEffect = (effect: AxiosRequestConfig, action: OfflineAction) =>
  axios(effect);
const offlineDiscard = (error: AxiosError, action: OfflineAction, retries: number) => {
  const { request, response } = error;
  if (!request) throw error; // There was an error creating the request
  if (!response) return false; // There was no response
  return 400 <= response.status && response.status < 500;
};
const offlineConfig = {
  ...offlineDefault,
  effect: offlineEffect,
  discard: offlineDiscard,
  persistOptions,
  persistCallback
};
const offline = createOffline(offlineConfig);
const logger = createLogger();
const saga = createSaga();

export const store = configureStore({
  reducer: offline.enhanceReducer(rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({})
      .splice(1, 1)
      .concat(logger, saga, offline.middleware),
  // this order of enhancers with offline first is necessary
  // otherwise offline/network_change actions are caught by the middleware
  enhancers: defaultEnhancers => [
    offline.enhanceStore as StoreEnhancer,
    ...defaultEnhancers
  ]
});
saga.run(rootSaga);

// // on starting the application, sync data if online
// if (window.navigator.onLine) {
//   store.dispatch(fetchTodos.request())
// }

export default store;
