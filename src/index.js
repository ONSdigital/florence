import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect } from 'react-router';
import { routerActions } from 'react-router-redux';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history3/redirect';

import App from './app/App';
import Layout from './app/global/Layout'
import LoginController from './app/views/login/LoginController';
import CollectionsController from './app/views/collections/CollectionsController';
import TeamsController from './app/views/teams/TeamsController';
import UsersController from './app/views/users/UsersController';
// import DatasetController from './app/views/datasets/DatasetsController';
// import DatasetOverviewController from './app/views/datasets/dataset-overview/DatasetOverviewController';
import Logs from './app/views/logs/Logs';

import auth from './app/utilities/auth'

import './scss/main.scss';

import { store, history } from './app/config/store';

import SelectableTest from './SelectableTest';
import PreviewController from './app/views/preview/PreviewController';

const rootPath = store.getState().state.rootPath;

const userIsAuthenticated = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAuthenticated(state.state.user);
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: `${rootPath}/login`
});

const userisAdminOrEditor = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdminOrEditor(state.state.user)
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'userisAdminOrEditor',
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false
})

class UnknownRoute extends Component {
    render() {
        return (
            <h1>Sorry, this page couldn't be found</h1>
        )
    }
}

class Users extends Component {
    render() {
        return (
            <h1>Users</h1>
        )
    }
}

class Index extends Component {
    render() {
        return (
            <Provider store={ store }>
                <Router history={ history }>
                    <Route component={ App }>
                        <Route component={ Layout }>
                            <Redirect from={`${rootPath}`} to={`${rootPath}/collections`} />
                            <Route path={`${rootPath}/collections`} component={ userIsAuthenticated(CollectionsController) }>
                                <Route path=':collectionID' component={ userIsAuthenticated(CollectionsController) }>
                                    <Route path='edit' component={ userIsAuthenticated(CollectionsController) }/>
                                    <Route path='restore-content' component={ userIsAuthenticated(CollectionsController) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/collections/:collectionID/preview`} component={ userIsAuthenticated(PreviewController) }/>
                            <Route path={`${rootPath}/teams`} component={ userIsAuthenticated(userisAdminOrEditor(TeamsController)) }>
                                <Route path={`:team`} component={ userIsAuthenticated(TeamsController) }>
                                    <Route path={`edit`} component={ userIsAuthenticated(TeamsController) }/>
                                    <Route path={`delete`} component={ userIsAuthenticated(TeamsController) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/users`} component={ userIsAuthenticated(userisAdminOrEditor(UsersController)) }/>
                            <Route path={`${rootPath}/selectable-list`} component={ SelectableTest } />
                            <Route path={`${rootPath}/logs`} component={ Logs } />
                            <Route path={`${rootPath}/login`} component={ LoginController } />
                            <Route path={`*`} component={ UnknownRoute } />
                        </Route>
                    </Route>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Index/>, document.getElementById('app'));


