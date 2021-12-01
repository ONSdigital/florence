import {push} from "react-router-redux";
import {getUsersRequestSuccess, newTeamUnsavedChanges} from "./actions";
import notifications from "../utilities/notifications";
import users from "../utilities/api-clients/user";
import teams from "../utilities/api-clients/teams";
import url from "../utilities/url";

export const getUsersRequest = () => dispatch => {
    users
        .getAllActive()
        .then(response => {
            dispatch(getUsersRequestSuccess(response));
        })
        .catch(error => {
            // TODO GO THROUGH ERROR MESSAGES AND ALSO MOVE THEM
            if (error.status != null) {
                if (error.status >= 400 && error.status < 500) {
                    switch (error.status) {
                        case 404: {
                            const notification = {
                                type: "warning",
                                message: `No API route available to get users.`,
                                autoDismiss: 5000,
                            };
                            notifications.add(notification);
                            break;
                        }
                        case "RESPONSE_ERR": {
                            const notification = {
                                type: "warning",
                                message:
                                    "An error's occurred whilst trying to get users. Please refresh the page, if this continues please contact an administrator",
                                isDismissable: true,
                            };
                            notifications.add(notification);
                            break;
                        }
                        case "UNEXPECTED_ERR": {
                            const notification = {
                                type: "warning",
                                message:
                                    "An unexpected error's occurred whilst trying to get users. You may only be able to see previously loaded information.",
                                isDismissable: true,
                            };
                            notifications.add(notification);
                            break;
                        }
                        case "FETCH_ERR": {
                            const notification = {
                                type: "warning",
                                message:
                                    "There's been a network error whilst trying to get users. You may only be able to see previously loaded information.",
                                isDismissable: true,
                            };
                            notifications.add(notification);
                            break;
                        }
                        default: {
                            log.event("Unhandled error fetching users", log.data({status_code: error.status}), log.error(error));
                            const notification = {
                                type: "warning",
                                message:
                                    "An unexpected error's occurred whilst trying to get users. You may only be able to see previously loaded information.",
                                isDismissable: true,
                            };
                            notifications.add(notification);
                            break;
                        }
                    }
                } else {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error has occurred whilst creating collection`,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                }
                console.error(error);
            } else {
                const notification = {
                    type: "warning",
                    message: `An unexpected error has occurred whilst creating collection`,
                    isDismissable: true,
                };
                notifications.add(notification);
            }
        });
};

export const createTeam = body => (dispatch, getState) => {
    dispatch(newTeamUnsavedChanges(false))
    teams
        .createTeam(body)
        .then(response => {
            //TODO may need to store state then reach into users.usersInTeam
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
        .catch(() => {
            dispatch(newTeamUnsavedChanges(true))
            // TODO
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
        .catch(() => {
            // TODO
            dispatch(newTeamUnsavedChanges(true))
            console.log("something went wrong");
        });
};
