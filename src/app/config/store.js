import { createStore, combineReducers, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { syncHistoryWithStore, routerReducer, routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import previousLocationMiddleware from "./previous-route-middleware";
import reducer from "./reducer";
import userReducer from "./user/userReducer";
import taxonomies from "./../reducers/taxonomies";

export const baseHistory = createBrowserHistory();
const routingMiddleware = routerMiddleware(baseHistory);

const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, routingMiddleware, previousLocationMiddleware));

export const store = createStore(
    combineReducers({
        state: reducer,
        user: userReducer,
        taxonomies,
        routing: routerReducer,
    }),
    enhancer
);

export const history = syncHistoryWithStore(baseHistory, store);
