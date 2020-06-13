import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import { createLogger } from "redux-logger";
import rootSaga from './sagas';

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = applyMiddleware(sagaMiddleware, logger);
const enhancer = composeEnhancer(middlewares);
const store = createStore(rootReducer, enhancer);
sagaMiddleware.run (rootSaga)

export default store
