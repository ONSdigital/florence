import { push } from "react-router-redux";
import { getUsersRequestSuccess, newTeamUnsavedChanges } from "./newTeam/newTeamActions";
import notifications from "../utilities/notifications";
import users from "../utilities/api-clients/user";
import teams from "../utilities/api-clients/teams";
import url from "../utilities/url";
import { errCodes } from "../utilities/errorCodes";

export const getUsersRequest = () => dispatch => {
    users
        .getAll({ active: true })
        .then(response => {
            dispatch(getUsersRequestSuccess(response));
        })
        .catch(error => {
            // TODO move, handling errors should be done elsewhere
            if (error.status != null) {
                if (error.status >= 400 && error.status < 500) {
                    switch (error.status) {
                        case 400: {
                            const notification = {
                                type: "warning",
                                message: errCodes.GET_USERS_UNEXPECTED_FILTER_ERROR,
                                autoDismiss: 5000,
                            };
                            notifications.add(notification);
                            break;
                        }
                        case 404: {
                            const notification = {
                                type: "warning",
                                message: errCodes.GET_USERS_NOT_FOUND,
                                autoDismiss: 5000,
                            };
                            notifications.add(notification);
                            break;
                        }
                        default: {
                            const notification = {
                                type: "warning",
                                message: errorCodes.GET_USERS_UNEXPECTED_ERROR_SHORT,
                                isDismissable: true,
                            };
                            notifications.add(notification);
                            break;
                        }
                    }
                } else {
                    const notification = {
                        type: "warning",
                        message: errCodes.GET_USERS_UNEXPECTED_ERROR_SHORT,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                }
            } else {
                const notification = {
                    type: "warning",
                    message: errCodes.GET_USERS_UNEXPECTED_ERROR_SHORT,
                    isDismissable: true,
                };
                notifications.add(notification);
            }
            console.error(error);
        });
};

export const createTeam = body => (dispatch, getState) => {
    dispatch(newTeamUnsavedChanges(false));
    teams
        .createTeam(body)
        .then(response => {
            const state = getState().state;
            if (state.newTeam.usersInTeam.length > 0) {
                dispatch(addMembersToTeam(response.groupname));
            } else {
                const notification = {
                    type: "positive",
                    isDismissable: true,
                    autoDismiss: 15000,
                    message: `The preview team '${response.name}' has been created successfully with ${state.newTeam.usersInTeam.length} members`,
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

export const addMembersToTeam = groupName => (dispatch, getState) => {
    let promises = [];
    const state = getState().state;
    state.newTeam.usersInTeam.forEach(user => {
        promises.push(teams.addMemberToTeam(groupName, user.id));
    });
    Promise.all(promises)
        .then(results => {
            //TODO may need to store state then reach into users.usersInTeam
            // TODO dispatch
            const notification = {
                type: "positive",
                isDismissable: true,
                autoDismiss: 15000,
                message: `The preview team '${results[0].description}' has been created successfully with ${state.newTeam.usersInTeam.length} members`,
            };
            notifications.add(notification);
            const previousUrl = url.resolve("../", true);
            dispatch(push(previousUrl));
        })
        .catch(error => {
            if (error.status != null && error.status === 400) {
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
