import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from "react-router";
import { routerActions } from "react-router-redux";
import { connectedReduxRedirect } from "redux-auth-wrapper/history3/redirect";
import { store, history } from "./app/config/store";
import { setConfig } from "./app/config/actions";
import auth, { getAuthState, getUserTypeFromAuthState } from "./app/utilities/auth";
import Layout from "./app/components/layout";
import SignInController from "./app/views/login/SignIn";
import ForgottenPasswordController from "./app/views/new-password/forgottenPasswordController";
import Collections from "./app/views/collections";
import CreateTeam from "./app/views/groups/create/CreateGroup"
import SelectADataset from "./app/views/datasets-new/DatasetsController";
import DatasetEditionsController from "./app/views/datasets-new/editions/DatasetEditionsController";
import DatasetVersionsController from "./app/views/datasets-new/versions/DatasetVersionsController";
import DatasetMetadataController from "./app/views/datasets-new/edit-metadata/DatasetMetadataController";
import CantabularMetadataController from "./app/views/datasets-new/edit-metadata-cantabular/CantabularMetadataController";
import CreateDatasetController from "./app/views/datasets-new/create/CreateDatasetController";
import CreateDatasetTaxonomyController from "./app/views/datasets-new/create/CreateDatasetTaxonomyController";
import CreateCantabularDatasetController from "./app/views/datasets-new/create/CreateCantabularDatasetController";
import CreateVersionController from "./app/views/datasets-new/create/CreateVersionController";
import CreateEditionController from "./app/views/datasets-new/create/CreateEditionController";
import DatasetUploadsController from "./app/views/uploads/dataset/DatasetUploadsController";
import DatasetUploadDetails from "./app/views/uploads/dataset/upload-details/DatasetUploadDetails";
import DatasetUploadMetadata from "./app/views/uploads/dataset/upload-details/DatasetUploadMetadata";
import EditHomepageController from "./app/views/homepage/edit/EditHomepageController";
import EditHomepageItem from "./app/views/homepage/edit/EditHomepageItem";
import SetForgottenPasswordController from "./app/views/new-password/setForgottenPasswordController";
import Logs from "./app/views/logs/Logs";
import SelectableTest from "./SelectableTest";
import PreviewController from "./app/views/preview/PreviewController";
import EditMetadataItem from "./app/views/datasets-new/edit-metadata/EditMetadataItem";
import CollectionRoutesWrapper from "./app/global/collection-wrapper/CollectionRoutesWrapper";
import WorkflowPreview from "./app/views/workflow-preview/WorkflowPreview";
import CreateContent from "./app/views/content/CreateContent";
import NotFound from "./app/components/not-found";
import UsersList from "./app/views/users";
import CreateUser from "./app/views/users/create";
import AddGroupsToUser from "./app/views/users/groups";
import Groups from "./app/views/groups"
import EditUser from "./app/views/users/edit";
import UploadTest from "./app/views/upload-test/UploadTest";
import "./scss/main.scss";
import Security from "./app/views/security";
import EditGroup from "./app/views/groups/edit"
import RedirectView from "./app/components/redirect-view";

import SessionManagement from "dis-authorisation-client-js";
import { startRefeshAndSession } from "./app/config/user/userActions";

import { browserHistory } from "react-router";
import user from "./app/utilities/api-clients/user";

const config = window.getEnv();
store.dispatch(setConfig(config));

const rootPath = store.getState().state.rootPath;
const allowedExternalRedirects = config.allowedExternalPaths;

const sessionConfig = {
    onRenewSuccess: (sessionExpiryTime, refreshExpiryTime) => {
        store.dispatch(startRefeshAndSession(refreshExpiryTime, sessionExpiryTime));
    },
    onSessionValid: (sessionExpiryTime, refreshExpiryTime) => {
        store.dispatch(startRefeshAndSession(refreshExpiryTime, sessionExpiryTime));
    },
};

SessionManagement.init(sessionConfig);

const userIsAuthenticated = connectedReduxRedirect({
    authenticatedSelector: state => {
        // TODO Remove getAuthToken() call when ENABLE_NEW_INTERACTIVES feature in prod
        return state.user.isAuthenticated || !!getAuthState();
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "UserIsAuthenticated",
    redirectPath: `${rootPath}/login`,
});

const userIsAdminOrEditor = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdminOrEditor(state.user) || auth.isAdminOrEditor(getUserTypeFromAuthState());
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "userIsAdminOrEditor",
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false
});

const userIsAdmin = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdmin(state.user) || auth.isAdmin(getUserTypeFromAuthState());
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "userIsAdmin",
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false
});

const logoutUser = async () => {
    try {
        user.logOut();
        browserHistory.push(`${rootPath}/login`);
    } catch (error) {
        console.error("Error during logout:", error);
        browserHistory.push(`${rootPath}/login`);
    }
};

const Index = () => {
    return (
        <Provider store={store}>
            <Router history={history}>
                <Route component={Layout}>
                    <Redirect from={`${rootPath}`} to={`${rootPath}/collections`} />
                    <Route path={`${rootPath}/collections`} component={userIsAuthenticated(Collections)}>
                        <Route path=":collectionID" component={userIsAuthenticated(Collections)}>
                            <Route path="edit" component={userIsAuthenticated(Collections)} />
                            <Route path="restore-content" component={userIsAuthenticated(Collections)} />
                        </Route>
                    </Route>
                    <Route component={CollectionRoutesWrapper}>
                        <Route path={`${rootPath}/collections/:collectionID/homepage`} component={userIsAuthenticated(EditHomepageController)}>
                            <Route
                                path={`edit/:homepageDataField/:homepageDataFieldID`}
                                component={userIsAuthenticated(EditHomepageItem)}
                            />
                        </Route>
                    </Route>
                    <Route path={`${rootPath}/collections/:collectionID/homepage/preview`} component={userIsAuthenticated(WorkflowPreview)} />
                    <Route path={`${rootPath}/collections/:collectionID/preview`} component={userIsAuthenticated(PreviewController)} />
                    <Route path={`${rootPath}/collections/:collectionID/create`} component={userIsAuthenticated(userIsAdminOrEditor(CreateContent))} />
                    <Route component={CollectionRoutesWrapper}>
                        <Route path={`${rootPath}/collections/:collectionID/datasets`}>
                            <IndexRoute component={userIsAuthenticated(SelectADataset)} />
                            <Route path="create">
                                <IndexRoute component={userIsAuthenticated(CreateDatasetController)} />
                                <Route path=":datasetID/:recipeID" component={userIsAuthenticated(CreateCantabularDatasetController)} />
                                <Route path=":datasetID" component={userIsAuthenticated(CreateDatasetTaxonomyController)} />
                            </Route>
                            <Route path=":datasetID">
                                <IndexRoute component={userIsAuthenticated(DatasetEditionsController)} />
                                <Route path={`editions`} component={userIsAuthenticated(CreateEditionController)} />
                                <Route path="editions/:editionID">
                                    <Route path={`instances`} component={userIsAuthenticated(CreateVersionController)} />
                                    <IndexRoute component={userIsAuthenticated(DatasetVersionsController)} />
                                    <Route path={`versions/:versionID`} component={userIsAuthenticated(DatasetMetadataController)}>
                                        <Route
                                            path={`edit/:metadataField/:metadataItemID`}
                                            component={userIsAuthenticated(EditMetadataItem)}
                                        />
                                    </Route>
                                    <Route path={`versions/:versionID/cantabular`} component={userIsAuthenticated(CantabularMetadataController)}>
                                        <Route
                                            path={`edit/:metadataField/:metadataItemID`}
                                            component={userIsAuthenticated(EditMetadataItem)}
                                        />
                                    </Route>
                                    <Route path="versions/:versionID/preview" component={userIsAuthenticated(WorkflowPreview)} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path={`${rootPath}/users/create`} exact component={userIsAuthenticated(userIsAdmin(CreateUser))} />
                    <Route path={`${rootPath}/users/:id`} exact component={userIsAuthenticated(userIsAdminOrEditor(EditUser))} />
                    <Route path={`${rootPath}/users/create/:id/groups`} component={userIsAuthenticated(userIsAdmin(AddGroupsToUser))} />
                    <Route path={`${rootPath}/users`} component={userIsAuthenticated(userIsAdminOrEditor(UsersList))}/>
                    <Route>
                        <Route path={`${rootPath}/uploads`}>
                            <IndexRedirect to="data" />
                            <Route path="data">
                                <IndexRoute component={userIsAuthenticated(userIsAdminOrEditor(DatasetUploadsController))} />
                                <Route path=":jobID">
                                    <IndexRoute component={userIsAuthenticated(userIsAdminOrEditor(DatasetUploadDetails))} />
                                    <Route path="metadata" component={userIsAuthenticated(userIsAdminOrEditor(DatasetUploadMetadata))} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path={`${rootPath}/upload-test`} component={config.enableNewUpload ? userIsAuthenticated(UploadTest) : null} />
                    <Route path={`${rootPath}/selectable-list`} component={SelectableTest} />
                    <Route path={`${rootPath}/logs`} component={Logs} />
                    <Route path={`${rootPath}/login`} component={SignInController} />
                    <Route path={`${rootPath}/logout`} onEnter={logoutUser}/>
                    <Route path={`${rootPath}/forgotten-password`} component={ForgottenPasswordController} />
                    <Route path={`${rootPath}/password-reset`} component={SetForgottenPasswordController} />
                    <Route path={`${rootPath}/groups`} component={userIsAuthenticated((Groups))} />
                    <Route path={`${rootPath}/security`} exact component={userIsAuthenticated(userIsAdmin(Security))} />
                    <Route path={`${rootPath}/groups/create`} exact component={userIsAuthenticated(userIsAdmin(CreateTeam))} />
                    <Route path={`${rootPath}/groups/:id`} component={userIsAuthenticated(EditGroup)} />
                    {/* legacy paths, stops the "not found" view from showing when loading */}
                    <Route path={`${rootPath}/publishing-queue`} />
                    <Route path={`${rootPath}/reports`} />
                    <Route path={`${rootPath}/workspace`} />

                    {allowedExternalRedirects.map(redirect => (
                        <React.Fragment key={redirect}>
                            <Route path={redirect} component={RedirectView} />
                            <Route path={`${redirect}/*`} component={RedirectView} />
                        </React.Fragment>
                    ))}

                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        </Provider>
    );
};

ReactDOM.render(<Index />, document.getElementById("app"));
