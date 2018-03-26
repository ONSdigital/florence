import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import { routerActions } from 'react-router-redux';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history3/redirect';

import App from './app/App';
import Layout from './app/global/Layout';
import LoginController from './app/views/login/LoginController';
import CollectionsController from './app/views/collections/CollectionsController';
import TeamsController from './app/views/teams/TeamsController';
import DatasetsController from './app/views/datasets/DatasetsController';
import DatasetUploadsController from './app/views/uploads/dataset/DatasetUploadsController';
import DatasetUploadDetails from './app/views/uploads/dataset/upload-details/DatasetUploadDetails';
import DatasetUploadMetadata from './app/views/uploads/dataset/upload-details/DatasetUploadMetadata'
import DatasetMetadata from './app/views/datasets/metadata/DatasetMetadata';
import VersionMetadata from './app/views/datasets/metadata/VersionMetadata';
import VersionCollectionController from './app/views/datasets/collection/VersionCollectionController';
import DatasetPreview from './app/views/datasets/preview/DatasetPreview';
import VersionPreview from './app/views/datasets/preview/VersionPreview';
import Logs from './app/views/logs/Logs';

import './scss/main.scss';

import { store, history } from './app/config/store';

import SelectableTest from './SelectableTest';

const rootPath = store.getState().state.rootPath;

const userIsAuthenticated = connectedReduxRedirect({
    authenticatedSelector: state => {
        return state.state.user.isAuthenticated;
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: `${rootPath}/login`
});

const userIsNotAuthorised = connectedReduxRedirect({
    authenticatedSelector: state => {
        return state.state.user.userType == 'ADMIN' || state.state.user.userType == 'EDITOR';
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: `${rootPath}/not-authorised`,
    allowRedirectBack: false
});

class UnknownRoute extends Component {
    render() {
        return (
            <div className="grid grid--justify-center">
                <h1>Sorry, this page couldnt be found</h1>
            </div>
        )
    }
}

class NotAuthorised extends Component {
    render() {
        return (
            <h1>Sorry, you don't have access to this screen. Please go to <a href="/ermintrude/index.html">Ermintrude</a>.</h1>
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
                            <Route path={`${rootPath}/collections`} component={ userIsAuthenticated(userIsNotAuthorised(CollectionsController)) }>
                                <Route path=':collectionID' component={ userIsAuthenticated(userIsNotAuthorised(CollectionsController)) }>
                                    <Route path='edit' component={ userIsAuthenticated(userIsNotAuthorised(CollectionsController)) }/>
                                    <Route path='restore-content' component={ userIsAuthenticated(userIsNotAuthorised(CollectionsController)) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/teams`} component={ userIsAuthenticated(TeamsController) }>
                                <Route path=":team" component={ userIsAuthenticated(TeamsController) }>
                                    <Route path="edit" component={ userIsAuthenticated(TeamsController) }/>
                                    <Route path="delete" component={ userIsAuthenticated(TeamsController) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/uploads`}>
                                <IndexRedirect to="data" />
                                <Route path="data">
                                    <IndexRoute component={userIsAuthenticated(DatasetUploadsController)} />
                                    <Route path=":jobID">
                                        <IndexRoute component={ userIsAuthenticated(DatasetUploadDetails) } />
                                        <Route path="metadata" component={ userIsAuthenticated(DatasetUploadMetadata) } />
                                    </Route>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/datasets`} >
                                <IndexRoute component={ userIsAuthenticated(DatasetsController) } />
                                <Route path=":datasetID">
                                    <IndexRedirect to={`${rootPath}/datasets`} />
                                    <Route path="preview" component={ userIsAuthenticated(DatasetPreview) } />
                                    <Route path="metadata" component={ userIsAuthenticated(DatasetMetadata) } />
                                    <Route path="editions/:edition/versions/:version">
                                        <IndexRedirect to="metadata"/>
                                        <Route path="metadata" component={ userIsAuthenticated(VersionMetadata) }/>
                                        <Route path="collection" >
                                            <IndexRoute component={ userIsAuthenticated(VersionCollectionController) } />
                                            <Route path="preview" component={ userIsAuthenticated(VersionPreview) } />
                                        </Route>
                                    </Route>
                                    <Route path="instances">
                                        <IndexRedirect to={`${rootPath}/datasets`}/>
                                        <Route path=":instanceID/metadata" component={ userIsAuthenticated(VersionMetadata) } />
                                    </Route>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/selectable-list`} component={ SelectableTest } />
                            <Route path={`${rootPath}/logs`} component={ Logs } />
                            <Route path={`${rootPath}/login`} component={ LoginController } />
                            <Route path={`${rootPath}/not-authorised`} component={ NotAuthorised } />
                            <Route path="*" component={ UnknownRoute } />
                        </Route>
                    </Route>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Index/>, document.getElementById('app'));
