import { push } from "react-router-redux";
import {
    loadCollectionsProgress,
    loadCollectionsSuccess,
    createCollectionSuccess,
    loadCollectionsFailure,
    updateCollectionFailure,
    updateCollectionSuccess,
    updateCollectionProgress,
    updateAllTeamsProgress,
    updateAllTeams,
    updateAllTeamsFailure,
    createUserSuccess,
    createUserFailure,
    createUserProgress,
} from "./actions";
import collections from "../utilities/api-clients/collections";
import teams from "../utilities/api-clients/teams";
import notifications from "../utilities/notifications";
import user from "../utilities/api-clients/user";
import collectionDetailsErrorNotifications from "../views/collections/details/collectionDetailsErrorNotifications";

export const loadCollectionsRequest = redirect => async dispatch => {
    dispatch(loadCollectionsProgress());
    await collections
        .getAll()
        .then(response => {
            if (!response) return dispatch(loadCollectionsFailure());
            return dispatch(loadCollectionsSuccess(response));
        })
        .catch(error => {
            dispatch(loadCollectionsFailure());
            // TODO: those were copied form the component will be here temporarily so we can agree on methods to deal with it
            switch (error.status) {
                case 404: {
                    const notification = {
                        type: "warning",
                        message: "No API route available to get collections",
                        autoDismiss: 5000,
                    };
                    notifications.add(notification);
                    dispatch(push(redirect));
                    break;
                }
                case 403: {
                    const notification = {
                        type: "warning",
                        message: "You don't have permissions to view collections",
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
                        message:
                            "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members.",
                        isDismissable: true,
                    });
                    break;
                }
                case "FETCH_ERR": {
                    const notification = {
                        type: "warning",
                        message:
                            "There's been a network error whilst trying to get collections. You may only be able to see previously loaded information and not be able to edit any team members.",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message:
                            "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members.",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error fetching all collections:\n", error);
        });
};

export const createCollectionRequest = collection => dispatch => {
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

export const loadTeamsRequest = () => dispatch => {
    dispatch(updateAllTeamsProgress());
    teams
        .getAll()
        .then(response => {
            if (!response) return dispatch(updateAllTeamsFailure());
            return dispatch(updateAllTeams(response));
        })
        .catch(error => {
            dispatch(updateAllTeamsFailure());
            switch (error.status) {
                case 401: {
                    // This is handled by the request function, so do nothing here
                    break;
                }
                case "RESPONSE_ERR": {
                    const notification = {
                        type: "warning",
                        message:
                            "There's been a network error whilst trying to get teams. You may only be able to see previously loaded information and not be able to edit any team members.",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
                case "UNEXPECTED_ERR": {
                    const notification = {
                        type: "warning",
                        message:
                            "An unexpected error's occurred whilst trying to get teams. You may only be able to see previously loaded information and won't be able to edit any team members.",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
                case "FETCH_ERR": {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get teams. Try refresh the page.",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error fetching all teams:\n", error);
        });
};
export const createUserRequest = newUser => dispatch => {
    dispatch(createUserProgress());
    user.createNewUser(newUser)
        .then(resp => {
            dispatch(createUserSuccess(resp));
            dispatch(push("/florence/users"));
            //TODO: can not test the response object atm so will change this later
            notifications.add({ type: "positive", message: "User created successfully", autoDismiss: 5000 });
        })
        .catch(e => {
            dispatch(createUserFailure());
            const errors = e.body.errors.map(err => `${err.code}: ${err.description}.`);
            if (errors) {
                notifications.add({ type: "warning", message: errors, autoDismiss: 5000 });
            }
        });
};
