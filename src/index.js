import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from "react-router";
import { routerActions } from "react-router-redux";
import { connectedReduxRedirect } from "redux-auth-wrapper/history3/redirect";
import { store, history } from "./app/config/store";
import { setConfig } from "./app/config/actions";
import auth from "./app/utilities/auth";
import Layout from "./app/components/layout";
import LoginController from "./app/views/login/LoginController";
import SignInController from "./app/views/login/SignIn";
import ForgottenPasswordController from "./app/views/new-password/forgottenPasswordController";
import Collections from "./app/views/collections";
import TeamsController from "./app/views/teams/TeamsController";
import SelectADataset from "./app/views/datasets-new/DatasetsController";
import DatasetEditionsController from "./app/views/datasets-new/editions/DatasetEditionsController";
import DatasetVersionsController from "./app/views/datasets-new/versions/DatasetVersionsController";
import DatasetMetadataController from "./app/views/datasets-new/edit-metadata/DatasetMetadataController";
import CreateDatasetController from "./app/views/datasets-new/create/CreateDatasetController";
import CreateDatasetTaxonomyController from "./app/views/datasets-new/create/CreateDatasetTaxonomyController";
import CreateCantabularDatasetController from "./app/views/datasets-new/create/CreateCantabularDatasetController";
import CreateVersionController from "./app/views/datasets-new/create/CreateVersionController";
import CreateEditionController from "./app/views/datasets-new/create/CreateEditionController";
import UsersController from "./app/views/users/UsersController";
import UserDetailsController from "./app/views/users/details/UserDetailsController";
import DatasetsController from "./app/views/datasets/DatasetsController";
import DatasetUploadsController from "./app/views/uploads/dataset/DatasetUploadsController";
import DatasetUploadDetails from "./app/views/uploads/dataset/upload-details/DatasetUploadDetails";
import DatasetUploadMetadata from "./app/views/uploads/dataset/upload-details/DatasetUploadMetadata";
import DatasetMetadata from "./app/views/datasets/metadata/DatasetMetadata";
import VersionMetadata from "./app/views/datasets/metadata/VersionMetadata";
import EditHomepageController from "./app/views/homepage/edit/EditHomepageController";
import EditHomepageItem from "./app/views/homepage/edit/EditHomepageItem";
import SetForgottenPasswordController from "./app/views/new-password/setForgottenPasswordController";
import Logs from "./app/views/logs/Logs";
import SelectableTest from "./SelectableTest";
import VersionPreviewController from "./app/views/datasets/preview/VersionPreviewController";
import PreviewController from "./app/views/preview/PreviewController";
import EditMetadataItem from "./app/views/datasets-new/edit-metadata/EditMetadataItem";
import ChangeUserPasswordController from "./app/views/users/change-password/ChangeUserPasswordController";
import ConfirmUserDeleteController from "./app/views/users/confirm-delete/ConfirmUserDeleteController";
import CollectionRoutesWrapper from "./app/global/collection-wrapper/CollectionRoutesWrapper";
import WorkflowPreview from "./app/views/workflow-preview/WorkflowPreview";
import CreateContent from "./app/views/content/CreateContent";
import NotFound from "./app/components/not-found";
import "./scss/main.scss";
import { errCodes } from "./app/utilities/errorCodes";
import notifications from "./app/utilities/notifications";
import UsersList from "./app/views/users/UsersList";
const config = window.getEnv();
store.dispatch(setConfig(config));

const rootPath = store.getState().state.rootPath;

const userIsAuthenticated = connectedReduxRedirect({
    authenticatedSelector: state => {
        return state.user.isAuthenticated;
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "UserIsAuthenticated",
    redirectPath: `${rootPath}/login`,
});

const userIsAdminOrEditor = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdminOrEditor(state.user);
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "userIsAdminOrEditor",
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false
});

const hasRedirect = () => {
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if (redirect) {
        const notification = {
            type: "neutral",
            message: errCodes.SESSION_EXPIRED,
            isDismissable: true,
            autoDismiss: 20000,
        };
        notifications.add(notification);
    }
    return config.enableNewSignIn ? SignInController : LoginController;
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
                    {config.enableDatasetImport === true && (
                        <Route component={CollectionRoutesWrapper}>
                            <Route path={`${rootPath}/collections/:collectionID/datasets`}>
                                <IndexRoute component={userIsAuthenticated(SelectADataset)} />
                                <Route path="create">
                                    <IndexRoute component={userIsAuthenticated(CreateDatasetController)} />
                                    <Route path=":datasetID/:format" component={userIsAuthenticated(CreateCantabularDatasetController)} />
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
                                        <Route path="versions/:versionID/preview" component={userIsAuthenticated(WorkflowPreview)} />
                                    </Route>
                                </Route>
                                <Route path="datasets/create" component={userIsAuthenticated(Collections)} />
                            </Route>
                        </Route>
                    )}
                    <Route path={`${rootPath}/teams`} component={userIsAuthenticated(userIsAdminOrEditor(TeamsController))}>
                        <Route path=":team" component={userIsAuthenticated(TeamsController)}>
                            <Route path="edit" component={userIsAuthenticated(TeamsController)} />
                            <Route path="delete" component={userIsAuthenticated(TeamsController)} />
                        </Route>
                    </Route>
                    <Route path={`${rootPath}/users`} component={userIsAuthenticated(userIsAdminOrEditor(config.enableNewSignIn ? UsersList : UsersController))}>
                        <Route path=":userID" component={userIsAuthenticated(userIsAdminOrEditor(UserDetailsController))}>
                            <Route
                                path="change-password"
                                component={userIsAuthenticated(userIsAdminOrEditor(ChangeUserPasswordController))}
                            />
                            <Route path="confirm-delete" component={userIsAuthenticated(userIsAdminOrEditor(ConfirmUserDeleteController))} />
                        </Route>
                    </Route>
                    {config.enableDatasetImport === true && (
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
                            <Route path={`${rootPath}/datasets`}>
                                <IndexRoute component={userIsAuthenticated(userIsAdminOrEditor(DatasetsController))} />
                                <Route path=":datasetID">
                                    <IndexRedirect to={`${rootPath}/datasets`} />
                                    <Route path="preview" component={userIsAuthenticated(userIsAdminOrEditor(WorkflowPreview))} />
                                    <Route path="metadata" component={userIsAuthenticated(userIsAdminOrEditor(DatasetMetadata))} />
                                    <Route path="editions/:edition/versions/:version">
                                        <IndexRedirect to="metadata" />
                                        <Route path="metadata" component={userIsAuthenticated(userIsAdminOrEditor(VersionMetadata))} />
                                        <Route
                                            path="preview"
                                            component={userIsAuthenticated(userIsAdminOrEditor(VersionPreviewController))}
                                        />
                                    </Route>
                                    <Route path="instances">
                                        <IndexRedirect to={`${rootPath}/datasets`} />
                                        <Route
                                            path=":instanceID/metadata"
                                            component={userIsAuthenticated(userIsAdminOrEditor(VersionMetadata))}
                                        />
                                    </Route>
                                </Route>
                            </Route>
                        </Route>
                    )}
                    <Route path={`${rootPath}/selectable-list`} component={SelectableTest} />
                    <Route path={`${rootPath}/logs`} component={Logs} />
                    <Route path={`${rootPath}/login`} component={hasRedirect()} />
                    <Route path={`${rootPath}/forgotten-password`} component={config.enableNewSignIn ? ForgottenPasswordController : null} />
                    <Route path={`${rootPath}/password-reset`} component={config.enableNewSignIn ? SetForgottenPasswordController : null} />
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        </Provider>
    );
};

ReactDOM.render(<Index />, document.getElementById("app"));