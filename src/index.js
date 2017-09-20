import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import App from './app/App';
import Layout from './app/global/Layout'
import LoginController from './app/views/login/LoginController';
import TeamsController from './app/views/teams/TeamsController';
// import DatasetController from './app/views/datasets/DatasetsController';
// import DatasetOverviewController from './app/views/datasets/dataset-overview/DatasetOverviewController';
import Logs from './app/views/logs/Logs';

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

const UserIsPublisher = UserAuthWrapper({
    authSelector: state => {
        return state.state.user.isAuthenticated ? state.state.user : {};
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsPublisher',
    failureRedirectPath: `${rootPath}/not-authorised`,
    predicate: user => user.userType == 'ADMIN' || user.userType == 'EDITOR',
})

class UnknownRoute extends Component {
    render() {
        return (
            <h1>Sorry, this page couldn't be found</h1>
        )
    }
}

class NotAuthorised extends Component {
    render() {
        return (
            <h1>Sorry, you don't have access to this. Please go to Ermintrude</h1>
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
                            <Redirect exact from={rootPath} to={`${rootPath}/collections`}/>
                            <Route path={`${rootPath}/teams`} component={ UserIsPublisher(TeamsController) }>
                                <Route path={`:team`} component={ UserIsPublisher(TeamsController) }>
                                    <Route path={`edit`} component={ UserIsPublisher(TeamsController) }/>
                                    <Route path={`delete`} component={ UserIsPublisher(TeamsController) }/>
                                </Route>
                            </Route>
                            {/* <Route path={`${rootPath}/datasets`} component={ UserIsAuthenticated(DatasetController) } /> */}
                            {/* <Route path={`${rootPath}/datasets/:job`} component={ UserIsAuthenticated(DatasetOverviewController) } /> */}
                            <Route path={`${rootPath}/logs`} component={ UserIsAuthenticated(Logs) } />
                            <Route path={`${rootPath}/login`} component={ LoginController } />
                            <Route path={`${rootPath}/not-authorised`} component={ NotAuthorised } />
                            <Route path={`*`} component={ UnknownRoute } />
                        </Route>
                    </Route>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Index/>, document.getElementById('app'));


