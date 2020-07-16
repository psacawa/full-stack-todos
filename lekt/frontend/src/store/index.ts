import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import { createLogger } from "redux-logger";
import { createOffline } from "@redux-offline/redux-offline";
import offlineDefault from "@redux-offline/redux-offline/lib/defaults";
import rootSaga from "./sagas";
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import { Action } from "redux";
import { OfflineAction } from "@redux-offline/redux-offline/lib/types";

const persistOptions = {
  keyPrefix: "root"
};
const persistCallback = () => {
  const key = store.getState().auth.key
  if (key) {
    axios.defaults.headers['Authorization'] = `Token ${key}`
  }
}

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
const { middleware: offlineMiddleware, enhanceReducer, enhanceStore } = createOffline(
  offlineConfig
);

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = applyMiddleware(sagaMiddleware, logger, offlineMiddleware);
const enhancer = composeEnhancers(enhanceStore, middlewares);
export const store = createStore(enhanceReducer(rootReducer), enhancer);
sagaMiddleware.run(rootSaga);

export default store;
