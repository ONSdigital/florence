import { createStore, combineReducers, applyMiddleware } from "redux";
//import createHistory from "history/createHashHistory";
import { routerReducer, routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import previousLocationMiddleware from "./previous-route-middleware";

import reducer from "./reducer";
//export const history = createHistory();
// export const baseHistory = browserHistory;
const routingMiddleware = routerMiddleware(history);
//console.log("ANNNA", history);

const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, routingMiddleware, previousLocationMiddleware));

export const store = createStore(
    combineReducers({
        state: reducer
        //routing: routerReducer
    }),
    enhancer
);

// export const history = syncHistoryWithStore(baseHistory, store);
// export const history = createHistory();
