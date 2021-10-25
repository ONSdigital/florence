import { createStore, combineReducers, applyMiddleware } from "redux";
import { browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer, routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import previousLocationMiddleware from "./previous-route-middleware";
import reducer from "./reducer";
import userReducer from "./user/userReducer";

export const baseHistory = browserHistory;
const routingMiddleware = routerMiddleware(baseHistory);

const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, routingMiddleware, previousLocationMiddleware));

export const store = createStore(
    combineReducers({
        state: reducer,
        user: userReducer,
        routing: routerReducer,
    }),
    enhancer
);

export const history = syncHistoryWithStore(baseHistory, store);
