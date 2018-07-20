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
// import DatasetController from './app/views/datasets/DatasetsController';
// import DatasetOverviewController from './app/views/datasets/dataset-overview/DatasetOverviewController';
import Logs from './app/views/logs/Logs';

import './scss/main.scss';

import { store, history } from './app/config/store';

import SelectableTest from './SelectableTest';
import { PreviewController } from './app/views/preview/PreviewController';

const rootPath = store.getState().state.rootPath;

const userIsAuthenticated = connectedReduxRedirect({
    authenticatedSelector: state => {
        return state.state.user.isAuthenticated;
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: `${rootPath}/login`
});

// const userIsNotAuthorised = connectedReduxRedirect({
//     authenticatedSelector: state => {
//         return state.state.user.userType == 'ADMIN' || state.state.user.userType == 'EDITOR';
//     },
//     redirectAction: routerActions.replace,
//     wrapperDisplayName: 'UserIsAuthenticated',
//     redirectPath: `${rootPath}/not-authorised`,
//     allowRedirectBack: false
// });

class UnknownRoute extends Component {
    render() {
        return (
            <h1>Sorry, this page couldn't be found</h1>
        )
    }
}

// class NotAuthorised extends Component {
//     render() {
//         return (
//             <h1>Sorry, you don't have access to this screen. Please go to <a href="/ermintrude/index.html">Ermintrude</a>.</h1>
//         )
//     }
// }

class Index extends Component {
    render() {
        return (
            <Provider store={ store }>
                <Router history={ history }>
                    <Route component={ App }>
                        <Route component={ Layout }>
                            <Redirect from={`${rootPath}`} to={`${rootPath}/collections`} />
                            <Route path={`${rootPath}/collections`} component={ userIsAuthenticated((CollectionsController)) }>
                                <Route path=':collectionID' component={ userIsAuthenticated((CollectionsController)) }>
                                    <Route path='edit' component={ userIsAuthenticated((CollectionsController)) }/>
                                    <Route path='restore-content' component={ userIsAuthenticated((CollectionsController)) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/teams`} component={ userIsAuthenticated((TeamsController)) }>
                                <Route path={`:team`} component={ userIsAuthenticated((TeamsController)) }>
                                    <Route path={`edit`} component={ userIsAuthenticated((TeamsController)) }/>
                                    <Route path={`delete`} component={ userIsAuthenticated((TeamsController)) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/preview`} component={ userIsAuthenticated(PreviewController) }/>
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


