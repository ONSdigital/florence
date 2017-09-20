import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import App from './app/App';
import Layout from './app/global/Layout'
import LoginController from './app/views/login/LoginController';
import TeamsController from './app/views/teams/TeamsController';
import DatasetsController from './app/views/datasets/DatasetsController';
import DatasetUploadsController from './app/views/datasets/dataset-upload/DatasetUploadsController';
import DatasetOverviewController from './app/views/datasets/dataset-overview/DatasetOverviewController';
import DatasetCollectionController from './app/views/datasets/dataset-collection/DatasetCollectionController';
import DatasetEdition from './app/views/datasets/dataset-metadata/DatasetEdition';

import './scss/main.scss';

import { store, history } from './app/config/store';
import DatasetChanges from './app/views/datasets/dataset-metadata/DatasetChanges'

const rootPath = store.getState().state.rootPath;

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => {
        return state.state.user.isAuthenticated ? state.state.user : {};
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    failureRedirectPath: `${rootPath}/login`
});

class UnknownRoute extends Component {
    render() {
        return (
            <h1>Sorry, this page couldn't be found</h1>
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
                            <Route path={`${rootPath}/teams`} component={ UserIsAuthenticated(TeamsController) }>
                                <Route path=":team" component={ UserIsAuthenticated(TeamsController) }>
                                    <Route path="edit" component={ UserIsAuthenticated(TeamsController) }/>
                                    <Route path="delete" component={ UserIsAuthenticated(TeamsController) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/datasets`} >
                                <IndexRoute component={ UserIsAuthenticated(DatasetsController) } />
                                <Redirect path="metadata" to={`${rootPath}/datasets`} />
                                <Route path="metadata/:instance" >
                                    <IndexRedirect to="edition" />
                                    <Route path="edition" component={ UserIsAuthenticated(DatasetEdition) } />
                                    <Route path="whats-changed" component={ UserIsAuthenticated(DatasetChanges) } />
                                </Route>
                                <Route path="uploads" component={ UserIsAuthenticated(DatasetUploadsController) } />
                                <Route path="uploads/:job" component={ UserIsAuthenticated(DatasetOverviewController) } />
                                <Route path="add-to-collection/:instance" component={ UserIsAuthenticated(DatasetCollectionController) } />
                            </Route>
                            <Route path={`${rootPath}/login`} component={ LoginController } />
                            <Route path="*" component={ UnknownRoute } />
                        </Route>
                    </Route>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Index/>, document.getElementById('app'));


