import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import Layout from './global/Layout'
import Collections from './collections/Collections';
import LoginController from './login/LoginController';

import { store, history } from './config/store';

const rootPath = store.getState().state.rootPath;

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => {
        return state.state.user.isAuthenticated ? state.state.user : {};
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    failureRedirectPath: `${rootPath}/login`
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
                        <Route path={rootPath} component={ UserIsAuthenticated(Collections) } />
                        <Route path={`${rootPath}/collections`} component={ UserIsAuthenticated(Collections) } />
                        <Route path={`${rootPath}/login`} component={ LoginController } />
                    </Route>
                </Router>
            </Provider>
        )
    }
}