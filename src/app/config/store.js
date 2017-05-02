import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

import reducer from './reducer';

export const baseHistory = browserHistory;
const routingMiddleware = routerMiddleware(baseHistory);

const enhancer = compose(
    applyMiddleware(thunkMiddleware, routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const store = createStore(
    combineReducers({
        state: reducer,
        routing: routerReducer
    }),
    enhancer
);

export const history = syncHistoryWithStore(baseHistory, store);