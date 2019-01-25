import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import { routerActions } from 'react-router-redux';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history3/redirect';

import { setConfig } from './app/config/actions';
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
import Logs from './app/views/logs/Logs';

import auth from './app/utilities/auth'
import log, { Http, Auth } from './app/utilities/log.ts'

import './scss/main.scss';

import { store, history } from './app/config/store';

import SelectableTest from './SelectableTest';
import DatasetPreviewController from './app/views/datasets/preview/DatasetPreviewController';
import VersionPreviewController from './app/views/datasets/preview/VersionPreviewController';
import PreviewController from './app/views/preview/PreviewController';

const config = window.getEnv();
store.dispatch(setConfig(config));

log.event("Test log 1")
log.event("Test log 2", new Http("hello"));
log.event("Test log 3", new Auth("hello"));
// log.event("test log 4", "hello");
// log.event("test log 5", "hello");

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
            <div className="grid grid--justify-center">
                <h1>Sorry, this page couldnt be found</h1>
            </div>
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
                                <Route path=":team" component={ userIsAuthenticated(TeamsController) }>
                                    <Route path="edit" component={ userIsAuthenticated(TeamsController) }/>
                                    <Route path="delete" component={ userIsAuthenticated(TeamsController) }/>
                                </Route>
                            </Route>
                            {config.enableDatasetImport === true &&
                                <Route>
                                    <Route path={`${rootPath}/uploads`}>
                                        <IndexRedirect to="data" />
                                        <Route path="data">
                                            <IndexRoute component={userIsAuthenticated(userisAdminOrEditor(DatasetUploadsController))} />
                                            <Route path=":jobID">
                                                <IndexRoute component={ userIsAuthenticated(userisAdminOrEditor(DatasetUploadDetails)) } />
                                                <Route path="metadata" component={ userIsAuthenticated(userisAdminOrEditor(DatasetUploadMetadata)) } />
                                            </Route>
                                        </Route>
                                    </Route>
                                    <Route path={`${rootPath}/datasets`} >
                                        <IndexRoute component={ userIsAuthenticated(userisAdminOrEditor(DatasetsController)) } />
                                        <Route path=":datasetID">
                                            <IndexRedirect to={`${rootPath}/datasets`} />
                                            <Route path="preview" component={ userIsAuthenticated(userisAdminOrEditor(DatasetPreviewController)) } />
                                            <Route path="metadata" component={ userIsAuthenticated(userisAdminOrEditor(DatasetMetadata)) } />
                                            <Route path="editions/:edition/versions/:version">
                                                <IndexRedirect to="metadata"/>
                                                <Route path="metadata" component={ userIsAuthenticated(userisAdminOrEditor(VersionMetadata)) }/>
                                                <Route path="preview" component={ userIsAuthenticated(userisAdminOrEditor(VersionPreviewController)) } />
                                            </Route>
                                            <Route path="instances">
                                                <IndexRedirect to={`${rootPath}/datasets`}/>
                                                <Route path=":instanceID/metadata" component={ userIsAuthenticated(userisAdminOrEditor(VersionMetadata)) } />
                                            </Route>
                                        </Route>
                                    </Route>
                                </Route>
                            }
                            <Route path={`${rootPath}/selectable-list`} component={ SelectableTest } />
                            <Route path={`${rootPath}/logs`} component={ Logs } />
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
