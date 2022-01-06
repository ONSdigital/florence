import { push } from "react-router-redux";
import {
    loadCollectionsProgress,
    loadCollectionsSuccess,
    createCollectionSuccess,
    loadCollectionsFailure,
    updateCollectionFailure,
    updateCollectionSuccess,
    updateCollectionProgress,
} from "./actions";
import collections from "../utilities/api-clients/collections";
import notifications from "../utilities/notifications";
import { UNEXPECTED_ERR, FETCH_ERR, NOT_FOUND_ERR, PERMISSIONS_ERR } from "../constants/Errors";
import collectionDetailsErrorNotifications from "../views/collections/details/collectionDetailsErrorNotifications";
import users from "../utilities/api-clients/user";
import { getUsersRequestSuccess, newTeamUnsavedChanges } from "./newTeam/newTeamActions";
import { errCodes } from "../utilities/errorCodes";
import teams from "../utilities/api-clients/teams";
import url from "../utilities/url";

export const loadCollectionsRequest = redirect => dispatch => {
    dispatch(loadCollectionsProgress());
    collections
        .getAll()
        .then(response => {
            if (!response) return dispatch(loadCollectionsFailure());
            return dispatch(loadCollectionsSuccess(response));
        })
        .catch(error => {
            // TODO: those were copied form the component will be here temporarily so we can agree on methods to deal with it
            switch (error.status) {
                case 404: {
                    const notification = {
                        type: "warning",
                        message: NOT_FOUND_ERR("collections"),
                        autoDismiss: 5000,
                    };
                    notifications.add(notification);
                    dispatch(push(redirect));
                    break;
                }
                case 403: {
                    const notification = {
                        type: "warning",
                        message: PERMISSIONS_ERR("collections"),
                        autoDismiss: 5000,
                    };
                    notifications.add(notification);
                    dispatch(push(redirect));
                    break;
                }
                case "RESPONSE_ERR":
                case "UNEXPECTED_ERR": {
                    notifications.add({
                        type: "warning",
                        message: UNEXPECTED_ERR("collections"),
                        isDismissable: true,
                    });
                    break;
                }
                case "FETCH_ERR": {
                    const notification = {
                        type: "warning",
                        message: FETCH_ERR("collections"),
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: UNEXPECTED_ERR("collections"),
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error fetching all collections:\n", error);
        });
};

export const createCollectionRequest = collection => (dispatch, getState) => {
    collections
        .create(collection)
        .then(response => {
            dispatch(createCollectionSuccess(response));
            dispatch(push("/florence/collections/" + response.id));
        })
        .catch(error => {
            // TODO: those were copied form the component will be here temporarily so we can agree on methods to deal with it

            switch (error.status) {
                case 401: {
                    break;
                }
                case 400: {
                    const notification = {
                        type: "warning",
                        message: "There was an error creating the collection. Please check inputs and try again.",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
                case 409: {
                    const notification = {
                        type: "warning",
                        message: error.body,
                        isDismissable: true,
                    };
                    notifications.add(notification);

                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error has occurred whilst creating collection`,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error(error);
        });
};

export const approveCollectionRequest = (id, redirect) => dispatch => {
    dispatch(updateCollectionProgress());
    collections
        .approve(id)
        .then(response => {
            if (response) {
                // TODO: correct API - the response is only 'true' so I need to fetch this collection separately
                collections.get(id).then(response => {
                    dispatch(updateCollectionSuccess(response));
                    dispatch(push(redirect));
                });
            }
        })
        .catch(error => {
            // TODO: those were copied form the component will be here temporarily so we can agree on methods to deal with it
            console.error("Error approving collection", error);
            dispatch(updateCollectionFailure());
            collectionDetailsErrorNotifications.updateCollection(error);
        });
};

export const getUsersRequest = () => dispatch => {
    users
        .getAll({ active: true })
        .then(response => {
            dispatch(getUsersRequestSuccess(response));
        })
        .catch(error => {
            console.error(error);
        });
};

export const createTeam = (body, usersInTeam) => (dispatch) => {
    dispatch(newTeamUnsavedChanges(false));
    teams
        .createTeam(body)
        .then(response => {
            if (usersInTeam.length > 0) {
                dispatch(addMembersToNewTeam(response.groupname, usersInTeam));
            } else {
                const notification = {
                    type: "positive",
                    isDismissable: true,
                    autoDismiss: 15000,
                    message: errCodes.CREATE_TEAM_SUCCESS(response.name, usersInTeam.length || 0),
                };
                notifications.add(notification);
                const previousUrl = url.resolve("../", true);
                dispatch(push(previousUrl));
            }
        })
        .catch(error => {
            dispatch(newTeamUnsavedChanges(true));
            if (error.status != null && error.status === 400) {
                const notification = {
                    type: "warning",
                    isDismissable: true,
                    autoDismiss: 15000,
                    message: errCodes.INVALID_NEW_TEAM_NAME,
                };
                notifications.add(notification);
            } else {
                const notification = {
                    type: "warning",
                    isDismissable: true,
                    autoDismiss: 15000,
                    message: errCodes.CREATE_GROUP_UNEXPECTED_ERROR,
                };
                notifications.add(notification);
            }
            console.error(error);
        });
};

const addMembersToNewTeam = (groupName, members) => dispatch => {
    let promises = [];
    members.forEach(user => {
        promises.push(teams.addMemberToTeam(groupName, user.id));
    });
    Promise.all(promises)
        .then(results => {
            const notification = {
                type: "positive",
                isDismissable: true,
                autoDismiss: 15000,
                message: errCodes.CREATE_TEAM_SUCCESS(results[0].description, members.length || ""),
            };
            notifications.add(notification);
            const previousUrl = url.resolve("../", true);
            dispatch(push(previousUrl));
        })
        .catch(error => {
            if (error.status && error.status === 400) {
                const notification = {
                    type: "warning",
                    isDismissable: true,
                    autoDismiss: 15000,
                    message: errCodes.INVALID_USER_BEING_ADDED_TO_TEAM,
                };
                notifications.add(notification);
            } else {
                const notification = {
                    type: "warning",
                    isDismissable: true,
                    autoDismiss: 15000,
                    message: errCodes.CREATE_GROUP_UNEXPECTED_ERROR,
                };
                notifications.add(notification);
            }
            console.error(error);
        });
};
