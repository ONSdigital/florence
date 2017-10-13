import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import App from './app/App';
import Layout from './app/global/Layout';
import LoginController from './app/views/login/LoginController';
import TeamsController from './app/views/teams/TeamsController';
import DatasetsController from './app/views/datasets/DatasetsController';
import DatasetUploadsController from './app/views/uploads/dataset/DatasetUploadsController';
import DatasetUploadDetails from './app/views/uploads/dataset/upload-details/DatasetUploadDetails';
import DatasetMetadata from './app/views/datasets/metadata/DatasetMetadata';
import VersionMetadata from './app/views/datasets/metadata/VersionMetadata';
import DatasetCollectionController from './app/views/datasets/collection/DatasetCollectionController';
import VersionCollectionController from './app/views/datasets/collection/VersionCollectionController';
import DatasetPreview from './app/views/datasets/preview/DatasetPreview';
import VersionPreview from './app/views/datasets/preview/VersionPreview';
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
                            <Redirect exact from={rootPath} to={`${rootPath}/collections`}/>
                            <Route path={`${rootPath}/teams`} component={ UserIsAuthenticated(TeamsController) }>
                                <Route path=":team" component={ UserIsAuthenticated(TeamsController) }>
                                    <Route path="edit" component={ UserIsAuthenticated(TeamsController) }/>
                                    <Route path="delete" component={ UserIsAuthenticated(TeamsController) }/>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/uploads`}>
                                <IndexRedirect to="data" />
                                <Route path="data">
                                    <IndexRoute component={UserIsAuthenticated(DatasetUploadsController)} />
                                    <Route path=":jobID" component={ UserIsAuthenticated(DatasetUploadDetails) } />
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/datasets`} >
                                <IndexRoute component={ UserIsAuthenticated(DatasetsController) } />
                                <Route path=":datasetID">
                                    <IndexRedirect to={`${rootPath}/datasets`} />
                                    <Route path="metadata">
                                        <IndexRoute component={ UserIsAuthenticated(DatasetMetadata) } />
                                        <Route path="collection">
                                            <IndexRoute component={ UserIsAuthenticated(DatasetCollectionController) } />
                                            <Route path="preview" component={ UserIsAuthenticated(DatasetPreview) } />
                                        </Route>
                                    </Route>
                                    <Route path="editions/:edition/versions/:version">
                                        <IndexRedirect to="metadata"/>
                                        <Route path="metadata" component={ UserIsAuthenticated(VersionMetadata) }/>
                                        <Route path="collection" >
                                            <IndexRoute component={ UserIsAuthenticated(VersionCollectionController) } />
                                            <Route path="preview" component={ UserIsAuthenticated(VersionPreview) } />
                                        </Route>
                                    </Route>
                                    <Route path="instances">
                                        <IndexRedirect to={`${rootPath}/datasets`}/>
                                        <Route path=":instanceID/metadata" component={ UserIsAuthenticated(VersionMetadata) } />
                                    </Route>
                                </Route>
                            </Route>
                            <Route path={`${rootPath}/logs`} component={ UserIsAuthenticated(Logs) } />
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
