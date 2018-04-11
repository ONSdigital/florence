import { createStore, combineReducers, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducer';

export const baseHistory = browserHistory;
const routingMiddleware = routerMiddleware(baseHistory);

const enhancer = composeWithDevTools(
    applyMiddleware(thunkMiddleware, routingMiddleware)
);

export const store = createStore(
    combineReducers({
        state: reducer,
        routing: routerReducer
    }),
    enhancer
);

export const history = syncHistoryWithStore(baseHistory, store);