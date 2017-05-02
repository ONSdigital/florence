import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import App from './app/App';
import Layout from './app/global/Layout'
import Collections from './app/collections/Collections';
import LoginController from './app/login/LoginController';
import TeamsController from './app/teams/TeamsController';

import './scss/main.scss';

import { store, history } from './app/config/store';

const rootPath = store.getState().state.rootPath;

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => {
        return state.state.user.isAuthenticated ? state.state.user : {};
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    failureRedirectPath: `${rootPath}/login`
});

class Index extends Component {
    render() {
        return (
            <Provider store={ store }>
                <Router history={ history }>
                    <Route component={ App }>
                        <Route component={ Layout }>
                            <Route path={rootPath} component={ UserIsAuthenticated(Collections) } />
                            <Route path={`${rootPath}/collections`} component={ UserIsAuthenticated(Collections) } />
                            <Route path={`${rootPath}/teams`} component={ UserIsAuthenticated(TeamsController) } />
                            <Route path={`${rootPath}/teams/:team`} component={ UserIsAuthenticated(TeamsController) } />
                            <Route path={`${rootPath}/login`} component={ LoginController } />
                        </Route>
                    </Route>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Index/>, document.getElementById('app'));


