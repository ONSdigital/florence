import React, { useState } from "react";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, IndexRedirect, Redirect, Routes } from "react-router";
import { routerActions } from "react-router-redux";
import { connectedReduxRedirect } from "redux-auth-wrapper/history3/redirect";
import { store, history } from "./config/store";
import { setConfig } from "./config/actions";
import auth, { getAuthState, getUserTypeFromAuthState } from "./utilities/auth";
import Layout from "./components/layout";
import LoginController from "./views/login/LoginController";
import SignInController from "./views/login/SignIn";
import ForgottenPasswordController from "./views/new-password/forgottenPasswordController";
import Collections from "./views/collections";
import TeamsController from "./views/teams/TeamsController";
import { InteractivesIndex, InteractivesForm, InteractivesDelete, InteractivesShow } from "./views/interactives";
import CreateTeam from "./views/teams/team-create/CreateTeam";
import SelectADataset from "./views/datasets-new/DatasetsController";
import DatasetEditionsController from "./views/datasets-new/editions/DatasetEditionsController";
import DatasetVersionsController from "./views/datasets-new/versions/DatasetVersionsController";
import DatasetMetadataController from "./views/datasets-new/edit-metadata/DatasetMetadataController";
import CreateDatasetController from "./views/datasets-new/create/CreateDatasetController";
import CreateDatasetTaxonomyController from "./views/datasets-new/create/CreateDatasetTaxonomyController";
import CreateCantabularDatasetController from "./views/datasets-new/create/CreateCantabularDatasetController";
import CreateVersionController from "./views/datasets-new/create/CreateVersionController";
import CreateEditionController from "./views/datasets-new/create/CreateEditionController";
import UsersController from "./views/users/UsersController";
import UserDetailsController from "./views/users/details/UserDetailsController";
import DatasetsController from "./views/datasets/DatasetsController";
import DatasetUploadsController from "./views/uploads/dataset/DatasetUploadsController";
import DatasetUploadDetails from "./views/uploads/dataset/upload-details/DatasetUploadDetails";
import DatasetUploadMetadata from "./views/uploads/dataset/upload-details/DatasetUploadMetadata";
import DatasetMetadata from "./views/datasets/metadata/DatasetMetadata";
import VersionMetadata from "./views/datasets/metadata/VersionMetadata";
import EditHomepageController from "./views/homepage/edit/EditHomepageController";
import EditHomepageItem from "./views/homepage/edit/EditHomepageItem";
import SetForgottenPasswordController from "./views/new-password/setForgottenPasswordController";
import Logs from "./views/logs/Logs";
import SelectableTest from "../SelectableTest";
import VersionPreviewController from "./views/datasets/preview/VersionPreviewController";
import PreviewController from "./views/preview/PreviewController";
import EditMetadataItem from "./views/datasets-new/edit-metadata/EditMetadataItem";
import ChangeUserPasswordController from "./views/users/change-password/ChangeUserPasswordController";
import ConfirmUserDeleteController from "./views/users/confirm-delete/ConfirmUserDeleteController";
import CollectionRoutesWrapper from "./global/collection-wrapper/CollectionRoutesWrapper";
import WorkflowPreview from "./views/workflow-preview/WorkflowPreview";
import CreateContent from "./views/content/CreateContent";
import NotFound from "./components/not-found";
import { errCodes } from "./utilities/errorCodes";
import notifications from "./utilities/notifications";
import UsersList from "./views/users";
import CreateUser from "./views/users/create";
import AddGroupsToUser from "./views/users/groups";
import Groups from "./views/groups";
import EditUser from "./views/users/edit";
import UploadTest from "./views/upload-test/UploadTest";

import "../scss/main.scss";
import Security from "./views/security";
import EditGroup from "./views/groups/edit";

const _config = window.getEnv();
store.dispatch(setConfig(_config));

const rootPath = store.getState().state.rootPath;

const userIsAuthenticated = connectedReduxRedirect({
    authenticatedSelector: state => {
        // TODO Remove getAuthState() call when ENABLE_NEW_INTERACTIVES feature in prod
        return state.user.isAuthenticated || !!getAuthState();
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "UserIsAuthenticated",
    redirectPath: `${rootPath}/login`,
});

const userIsAdminOrEditor = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdminOrEditor(state.user) || auth.isAdmin(getUserTypeFromAuthState());
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "userIsAdminOrEditor",
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false,
});

const userIsAdmin = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdmin(state.user) || auth.isAdmin(getUserTypeFromAuthState());
    },
    redirectAction: routerActions.replace,
    wrapperDisplayName: "userIsAdmin",
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false,
});

const hasRedirect = config => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
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

export const appRoutes = config => (
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
                <Route path={`edit/:homepageDataField/:homepageDataFieldID`} component={userIsAuthenticated(EditHomepageItem)} />
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
                                <Route path={`edit/:metadataField/:metadataItemID`} component={userIsAuthenticated(EditMetadataItem)} />
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
        {config.enableNewInteractives && <Route path={`${rootPath}/interactives`} exact component={userIsAuthenticated(InteractivesIndex)} />}
        {config.enableNewInteractives && <Route path={`${rootPath}/interactives/create`} exact component={userIsAuthenticated(InteractivesForm)} />}
        {config.enableNewInteractives && (
            <Route path={`${rootPath}/interactives/edit/:interactiveId`} exact component={userIsAuthenticated(InteractivesForm)} />
        )}
        {config.enableNewInteractives && (
            <Route path={`${rootPath}/interactives/show/:interactiveId`} exact component={userIsAuthenticated(InteractivesShow)} />
        )}
        {config.enableNewInteractives && (
            <Route path={`${rootPath}/interactives/delete/:interactiveId`} exact component={userIsAuthenticated(InteractivesDelete)} />
        )}
        {config.enableNewSignIn && <Route path={`${rootPath}/users/create`} exact component={userIsAuthenticated(userIsAdmin(CreateUser))} />}
        {config.enableNewSignIn && <Route path={`${rootPath}/users/:id`} exact component={userIsAuthenticated(userIsAdmin(EditUser))} />}
        {config.enableNewSignIn && (
            <Route path={`${rootPath}/users/create/:id/groups`} component={userIsAuthenticated(userIsAdmin(AddGroupsToUser))} />
        )}
        <Route path={`${rootPath}/users`} component={userIsAuthenticated(userIsAdminOrEditor(config.enableNewSignIn ? UsersList : UsersController))}>
            <Route path=":userID" component={userIsAuthenticated(userIsAdminOrEditor(UserDetailsController))}>
                <Route path="change-password" component={userIsAuthenticated(userIsAdminOrEditor(ChangeUserPasswordController))} />
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
                            <Route path="preview" component={userIsAuthenticated(userIsAdminOrEditor(VersionPreviewController))} />
                        </Route>
                        <Route path="instances">
                            <IndexRedirect to={`${rootPath}/datasets`} />
                            <Route path=":instanceID/metadata" component={userIsAuthenticated(userIsAdminOrEditor(VersionMetadata))} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        )}
        <Route path={`${rootPath}/upload-test`} component={config.enableNewUpload ? userIsAuthenticated(UploadTest) : null} />
        <Route path={`${rootPath}/selectable-list`} component={SelectableTest} />
        <Route path={`${rootPath}/logs`} component={Logs} />
        <Route path={`${rootPath}/login`} component={hasRedirect(config)} />
        <Route path={`${rootPath}/forgotten-password`} component={config.enableNewSignIn ? ForgottenPasswordController : null} />
        <Route path={`${rootPath}/password-reset`} component={config.enableNewSignIn ? SetForgottenPasswordController : null} />
        <Route path={`${rootPath}/groups`} component={config.enableNewSignIn ? userIsAuthenticated(userIsAdmin(Groups)) : null} />
        {config.enableNewSignIn && <Route path={`${rootPath}/security`} exact component={userIsAuthenticated(userIsAdmin(Security))} />}
        {config.enableNewSignIn && <Route path={`${rootPath}/groups/create`} exact component={userIsAuthenticated(userIsAdmin(CreateTeam))} />}
        {config.enableNewSignIn && <Route path={`${rootPath}/groups/:id`} component={userIsAuthenticated(userIsAdmin(EditGroup))} />}
        <Route path="*" component={NotFound} />
    </Route>
);

export const App = () => {
    return (
        <Provider store={store}>
            <Router history={history}>{appRoutes(_config)}</Router>
        </Provider>
    );
};
