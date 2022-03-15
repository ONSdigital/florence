import { push } from "react-router-redux";
import * as actions from "./actions";
import collections from "../utilities/api-clients/collections";
import notifications from "../utilities/notifications";
import user from "../utilities/api-clients/user";
import collectionDetailsErrorNotifications from "../views/collections/details/collectionDetailsErrorNotifications";
import users from "../utilities/api-clients/user";
import { errCodes } from "../utilities/errorCodes";
import teams from "../utilities/api-clients/teams";
import url from "../utilities/url";

export const loadCollectionsRequest = redirect => async dispatch => {
    dispatch(actions.loadCollectionsProgress());
    await collections
        .getAll()
        .then(response => {
            if (!response) return dispatch(actions.loadCollectionsFailure());
            return dispatch(actions.loadCollectionsSuccess(response));
        })
        .catch(error => {
            dispatch(actions.loadCollectionsFailure());
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
            dispatch(actions.createCollectionSuccess(response));
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
    dispatch(actions.updateCollectionProgress());
    collections
        .approve(id)
        .then(response => {
            if (response) {
                // TODO: correct API - the response is only 'true' so I need to fetch this collection separately
                collections.get(id).then(response => {
                    dispatch(actions.updateCollectionSuccess(response));
                    dispatch(push(redirect));
                });
            }
        })
        .catch(error => {
            // TODO: those were copied form the component will be here temporarily so we can agree on methods to deal with it
            console.error("Error approving collection", error);
            dispatch(actions.updateCollectionFailure());
            collectionDetailsErrorNotifications.updateCollection(error);
        });
};

export const fetchGroupsRequest = isNewSignIn => dispatch => {
    dispatch(actions.loadGroupsProgress());
    isNewSignIn
        ? teams
              .getGroups()
              .then(response => {
                  dispatch(actions.loadGroupsSuccess(response.groups));
              })
              .catch(error => {
                  dispatch(actions.loadGroupsFailure());
                  //TODO: map responses to user friendly by content designer
                  if (error) {
                      notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
                  }
                  console.error(error);
              })
        : teams
              .getAll()
              .then(response => {
                  if (!response) return dispatch(actions.loadGroupsFailure());
                  return dispatch(actions.loadGroupsSuccess(response));
              })
              .catch(error => {
                  dispatch(actions.loadGroupsFailure());
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

export const createUserRequest = body => dispatch => {
    dispatch(actions.createUserProgress());
    user.createNewUser(body)
        .then(response => {
            console.log("response", response); // TODO: leaving this here to check what is actually coming back as couldn't test locally
            dispatch(actions.createUserSuccess());
            //TODO: this is not working at the moment so I am faking. I will expect user ID not email
            dispatch(push(`/florence/users/create/${body.email}/groups`));

            notifications.add({ type: "positive", message: "User created successfully", autoDismiss: 5000 });
        })
        .catch(error => {
            dispatch(actions.createUserFailure());
            //TODO: this is not working at the moment so I am faking. I will expect user ID not email
            dispatch(push(`/florence/users/create/${body.email}/groups`));

            // dispatch(push("/florence/users")); TODO: uncomment later when api works
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const fetchUserGroupsRequest = id => dispatch => {
    dispatch(actions.loadUserGroupsProgress());
    user.getUserGroups(id)
        .then(response => {
            dispatch(actions.loadUserGroupsSuccess(response.groups));
        })
        .catch(error => {
            dispatch(actions.loadUserGroupsFailure());
            dispatch(push("/florence/users"));
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const updateUserRequest = (id, body) => dispatch => {
    dispatch(actions.updateUserProgress());
    user.updateUser(id, body)
        .then(response => {
            dispatch(actions.updateUserSuccess());
            dispatch(push(url.resolve("../", true)));
            notifications.add({ type: "positive", message: `User ${response.email} updated successfully`, autoDismiss: 5000 });
        })
        .catch(error => {
            dispatch(actions.updateUserFailure());
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const getUsersRequest = () => dispatch => {
    dispatch(actions.loadUsersProgress());
    users
        .getUsers()
        .then(response => {
            dispatch(actions.loadUsersSuccess(response.users));
        })
        .catch(error => {
            dispatch(actions.loadUsersFailure());
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const createTeam = (body, usersInTeam) => dispatch => {
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

export const fetchUserRequest = id => dispatch => {
    dispatch(actions.loadUserProgress());
    user.getUser(id)
        .then(response => {
            dispatch(actions.loadUserSuccess(response));
        })
        .catch(error => {
            dispatch(actions.loadUserFailure());
            //TODO: map responses to user friendly by content designer
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const addGroupsToUserRequest = (userId, groups) => dispatch => {
    dispatch(actions.addGroupsToUserProgress());
    let promises = [];
    groups.forEach(group => promises.push(teams.addMemberToTeam(group, userId)));

    Promise.all(promises)
        .then(response => {
            dispatch(actions.addGroupsToUserSuccess(userId, response));
            dispatch(push(`/florence/users`));
            //TODO: can not test the response object atm so will change this later
            notifications.add({ type: "positive", message: "Teams added to user successfully", autoDismiss: 5000 });
        })
        .catch(error => {
            dispatch(actions.addGroupsToUserFailure());
            //TODO: map responses to user friendly by content designer
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const deleteTokensRequest = () => dispatch => {
    dispatch(actions.singOutAllUsersProgress());
    user.deleteTokens()
        .then(response => {
            console.log("deleteTokensRequest", response); // TODO: leaving this here to check what is actually coming back as couldn't test locally
            dispatch(actions.singOutAllUsersSuccess());
            //TODO: can not test the response object atm so will change this later
            notifications.add({ type: "positive", message: "All users signed out successfully.", autoDismiss: 5000 });
        })
        .catch(error => {
            dispatch(actions.singOutAllUsersFailure());
            //TODO: map responses to user friendly by content designer
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};
