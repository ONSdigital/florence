import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import { ConnectedRouter, replace } from "connected-react-router";
import { connectedReduxRedirect } from "redux-auth-wrapper/history4/redirect";
import { store, baseHistory as history } from "./app/config/store";
import { setConfig } from "./app/config/actions";
import PropTypes from "prop-types";
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
import SetForgottenPasswordController from "./app/views/new-password/setForgottenPasswordController";
import Logs from "./app/views/logs/Logs";
import PreviewController from "./app/views/preview/PreviewController";
import EditMetadataItem from "./app/views/datasets-new/edit-metadata/EditMetadataItem";
import WorkflowPreview from "./app/views/workflow-preview/WorkflowPreview";
import CreateContent from "./app/views/content/CreateContent";
import { withCollectionDetails } from "./app/views/collections/details/withCollectionDetails";
import NotFound from "./app/components/not-found";
import UsersList from "./app/views/users";
import CreateUser from "./app/views/users/create";
import AddGroupsToUser from "./app/views/users/groups";
import Groups from "./app/views/groups"
import EditUser from "./app/views/users/edit";
import "./scss/main.scss";
import Security from "./app/views/security";
import Systems from "./app/views/systems";
import EditGroup from "./app/views/groups/edit"
import RedirectView from "./app/components/redirect-view";

import SessionManagement from "dis-authorisation-client-js";
import { startRefeshAndSession } from "./app/config/user/userActions";

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
    redirectAction: replace,
    wrapperDisplayName: "UserIsAuthenticated",
    redirectPath: `${rootPath}/login`,
});

const userIsAdminOrEditor = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdminOrEditor(state.user) || auth.isAdminOrEditor(getUserTypeFromAuthState());
    },
    redirectAction: replace,
    wrapperDisplayName: "userIsAdminOrEditor",
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false
});

const userIsAdmin = connectedReduxRedirect({
    authenticatedSelector: state => {
        return auth.isAdmin(state.user) || auth.isAdmin(getUserTypeFromAuthState());
    },
    redirectAction: replace,
    wrapperDisplayName: "userIsAdmin",
    redirectPath: `${rootPath}/collections`,
    allowRedirectBack: false
});

const logoutUser = async () => {
    try {
        user.logOut();
        history.push(`${rootPath}/login`);
    } catch (error) {
        console.error("Error during logout:", error);
        history.push(`${rootPath}/login`);
    }
};

const UploadRoutes = ({ match }) => (
    <>
        <Redirect exact from={`${rootPath}/uploads`} to={`${rootPath}/uploads/data`} />
        <Switch>
            <Route path={`${match.path}/data`} exact component={userIsAuthenticated(userIsAdminOrEditor(DatasetUploadsController))} />
            <Route path={`${match.path}/data/:jobID`} exact component={userIsAuthenticated(userIsAdminOrEditor(DatasetUploadDetails))} />
            <Route path={`${match.path}/data/:jobID/metadata`} exact component={userIsAuthenticated(userIsAdminOrEditor(DatasetUploadMetadata))} />
        </Switch>
    </>
);

UploadRoutes.propTypes = {
    match: PropTypes.shape({
        path: PropTypes.string.isRequired,
    }).isRequired,
}

const CollectionDatasetRoutes = ({ match }) => (
    <Switch>
        <Route path={`${match.path}`} exact component={AuthenticatedSelectADataset} />

        <Route path={`${match.path}/create`} exact component={AuthenticatedCreateDatasetController} />
        <Route path={`${match.path}/create/:datasetID/:recipeID`} component={AuthenticatedCreateCantabularDatasetController} />
        <Route path={`${match.path}/create/:datasetID`} component={AuthenticatedCreateDatasetTaxonomyController} />

        <Route path={`${match.path}/:datasetID`} exact component={AuthenticatedDatasetEditionsController} />
        <Route path={`${match.path}/:datasetID/editions`} exact component={AuthenticatedCreateEditionController} />
        <Route path={`${match.path}/:datasetID/editions/:editionID`} exact component={AuthenticatedDatasetVersionsController} />
        <Route path={`${match.path}/:datasetID/editions/:editionID/instances`} component={AuthenticatedCreateVersionController} />
        <Route path={`${match.path}/:datasetID/editions/:editionID/preview`} exact component={AuthenticatedWorkflowPreviewWithCollection} />
        <Route path={`${match.path}/:datasetID/editions/:editionID/versions/:versionID`} exact component={AuthenticatedDatasetMetadataController} />
        <Route path={`${match.path}/:datasetID/editions/:editionID/versions/:versionID/edit/:metadataField/:metadataFieldID`} exact component={AuthenticatedEditMetadataItem} />
        <Route path={`${match.path}/:datasetID/editions/:editionID/versions/:versionID/cantabular`} exact component={AuthenticatedCantabularMetadataController} />
        <Route path={`${match.path}/:datasetID/editions/:editionID/versions/:versionID/cantabular/edit/:metadataField/:metadataItemID`} exact component={AuthenticatedEditMetadataItem} />
    </Switch>
)

CollectionDatasetRoutes.propTypes = {
        match: PropTypes.shape({
        path: PropTypes.string.isRequired,
    }).isRequired,
}

const AuthenticatedCollections = userIsAuthenticated(Collections);
const AuthenticatedWorkflowPreview = userIsAuthenticated(WorkflowPreview);
const AuthenticatedPreviewController = userIsAuthenticated(PreviewController);
const AuthenticatedEditHomepageController = withCollectionDetails(userIsAuthenticated(EditHomepageController));
const AuthenticatedCreateContent = userIsAuthenticated(userIsAdminOrEditor(CreateContent));

// Collection dataset routes with collection details
const AuthenticatedSelectADataset = withCollectionDetails(userIsAuthenticated(SelectADataset));
const AuthenticatedCreateDatasetController = withCollectionDetails(userIsAuthenticated(CreateDatasetController));
const AuthenticatedCreateCantabularDatasetController = withCollectionDetails(userIsAuthenticated(CreateCantabularDatasetController));
const AuthenticatedCreateDatasetTaxonomyController = withCollectionDetails(userIsAuthenticated(CreateDatasetTaxonomyController));
const AuthenticatedDatasetEditionsController = withCollectionDetails(userIsAuthenticated(DatasetEditionsController));
const AuthenticatedCreateEditionController = withCollectionDetails(userIsAuthenticated(CreateEditionController));
const AuthenticatedDatasetVersionsController = withCollectionDetails(userIsAuthenticated(DatasetVersionsController));
const AuthenticatedCreateVersionController = withCollectionDetails(userIsAuthenticated(CreateVersionController));
const AuthenticatedWorkflowPreviewWithCollection = withCollectionDetails(userIsAuthenticated(WorkflowPreview));
const AuthenticatedDatasetMetadataController = withCollectionDetails(userIsAuthenticated(DatasetMetadataController));
const AuthenticatedEditMetadataItem = withCollectionDetails(userIsAuthenticated(EditMetadataItem));
const AuthenticatedCantabularMetadataController = withCollectionDetails(userIsAuthenticated(CantabularMetadataController));

const CollectionRoutes = ({ match }) => (

    <Switch>
        <Route path={`${match.path}`} exact component={AuthenticatedCollections} />
        <Route path={`${match.path}/:collectionID`} exact component={AuthenticatedCollections} />

        <Route path={`${match.path}/:collectionID/create`} component={AuthenticatedCreateContent} />

        <Route path={`${match.path}/:collectionID/datasets`} component={CollectionDatasetRoutes} />

        <Route path={`${match.path}/:collectionID/edit`} component={AuthenticatedCollections} />

        <Route path={`${match.path}/:collectionID/homepage`} exact component={AuthenticatedEditHomepageController} />
        <Route
            path={`${match.path}/:collectionID/homepage/edit/:homepageDataField/:homepageDataFieldID`}
            exact
            component={AuthenticatedEditHomepageController}
        />
        <Route path={`${match.path}/:collectionID/homepage/preview`} component={AuthenticatedWorkflowPreview} /> 
        
        <Route path={`${match.path}/:collectionID/preview`} component={AuthenticatedPreviewController} />                        
    </Switch>
);

CollectionRoutes.propTypes = {
    match: PropTypes.shape({
        path: PropTypes.string.isRequired,
    }).isRequired,
};

const AuthenticatedCreateUser = userIsAuthenticated(userIsAdmin(CreateUser));
const AuthenticatedEditUser = userIsAuthenticated(userIsAdminOrEditor(EditUser));
const AuthenticatedAddGroupsToUser = userIsAuthenticated(userIsAdmin(AddGroupsToUser));
const AuthenticatedUsersList = userIsAuthenticated(userIsAdminOrEditor(UsersList));

const UserRoutes = ({ match }) => (
    <Switch>
        <Route path={`${match.path}/create`} exact component={AuthenticatedCreateUser} />
        <Route path={`${match.path}/:id`} exact component={AuthenticatedEditUser} />
        <Route path={`${match.path}/create/:id/groups`} component={AuthenticatedAddGroupsToUser} />
        <Route exact path={`${match.path}`} component={AuthenticatedUsersList}/>
    </Switch>
)

UserRoutes.propTypes = {
    match: PropTypes.shape({
        path: PropTypes.string.isRequired,
    }).isRequired,
};

const AuthenticatedCreateTeam = userIsAuthenticated(userIsAdmin(CreateTeam));
const AuthenticatedEditGroup = userIsAuthenticated(EditGroup);
const AuthenticatedGroups = userIsAuthenticated(Groups);

const GroupRoutes = ({ match }) => (
    <Switch>
        <Route path={`${match.path}`} exact component={AuthenticatedGroups} />
        <Route path={`${match.path}/create`} exact component={AuthenticatedCreateTeam} />
        <Route path={`${match.path}/:id`} component={AuthenticatedEditGroup} />
    </Switch>
)

GroupRoutes.propTypes = {
    match: PropTypes.shape({
        path: PropTypes.string.isRequired,
    }).isRequired,
};

const Index = () => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Route render={routeProps => {
                    return (
                        <Layout {...routeProps}>
                            <Switch>
                                <Redirect exact from={`${rootPath}`} to={`${rootPath}/collections`} />
                                <Route path={`${rootPath}/collections`} component={CollectionRoutes} />

                                <Route path={`${rootPath}/forgotten-password`} component={ForgottenPasswordController} />
                                <Route path={`${rootPath}/groups`} component={GroupRoutes} />

                                <Route path={`${rootPath}/login`} component={SignInController} />
                                <Route path={`${rootPath}/logout`} render={() => { logoutUser(); return null; }} />
                                <Route path={`${rootPath}/logs`} component={Logs} />

                                <Route path={`${rootPath}/password-reset`} component={SetForgottenPasswordController} />

                                {/* legacy path, stops the "not found" view from showing when loading */}
                                <Route path={`${rootPath}/publishing-queue`} />

                                <Route path={`${rootPath}/security`} exact component={userIsAuthenticated(userIsAdmin(Security))} />
                                <Route path={`${rootPath}/systems`} exact component={userIsAuthenticated(Systems)} />
                                <Route path={`${rootPath}/uploads`} component={UploadRoutes} />
                                <Route path={`${rootPath}/users`} component={UserRoutes} />

                                {/* legacy path, stops the "not found" view from showing when loading */}
                                <Route path={`${rootPath}/workspace`} />

                                {allowedExternalRedirects.map(redirect => (
                                    <React.Fragment key={redirect}>
                                        <Route path={redirect} component={RedirectView} />
                                        <Route path={`${redirect}/*`} component={RedirectView} />
                                    </React.Fragment>
                                ))}

                                <Route component={NotFound} />
                            </Switch>

                        </Layout>
                    );
                }} />
            </ConnectedRouter>
        </Provider>
    );
};

// Render is deprecated for when we move to React 18, when we should use createRoot
ReactDOM.render(<Index />, document.getElementById("app"));
