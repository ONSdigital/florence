import { createStore, combineReducers, applyMiddleware } from "redux";
import { browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer, routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import previousLocationMiddleware from "./previous-route-middleware";
import reducer from "./reducer";
import userReducer from "./user/userReducer";
import interactives from "./../reducers/interactives";
import taxonomies from "./../reducers/taxonomies";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const baseHistory = browserHistory;
const routingMiddleware = routerMiddleware(baseHistory);

const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, routingMiddleware, previousLocationMiddleware));

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        state: reducer,
        user: userReducer,
        interactives,
        taxonomies,
        routing: routerReducer,
    })
);

export const store = createStore(persistedReducer, enhancer);

export const persistor = persistStore(store);

export const history = syncHistoryWithStore(baseHistory, store);
