import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerActions, routerMiddleware, push } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import thunkMiddleware from 'redux-thunk';

import Layout from './global/Layout'
import Collections from './collections/Collections';
import Login from './login/Login';

import reducer from './config/reducer';

const baseHistory = browserHistory;
const routingMiddleware = routerMiddleware(baseHistory);

const enhancer = compose(
    applyMiddleware(thunkMiddleware, routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const store = createStore(
    combineReducers({
        state: reducer,
        routing: routerReducer
    }),
    enhancer
);

const history = syncHistoryWithStore(baseHistory, store);

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => {
        return state.state.user.isAuthenticated ? state.state.user : {};
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    failureRedirectPath: '/florence/login'
});

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Provider store={ store }>
                <Router history={ history }>
                    <Route component={ Layout }>
                        <Route path="/florence" component={ UserIsAuthenticated(Collections) } />
                        <Route path="/florence/collections" component={ Collections } />
                        <Route path="/florence/login" component={ Login } />
                    </Route>
                </Router>
            </Provider>
        )
    }
}