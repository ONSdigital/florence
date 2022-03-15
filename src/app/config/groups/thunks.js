import { push } from "react-router-redux";
import * as actions from "./actions";
import notifications from "../../utilities/notifications";
import teams from "../../utilities/api-clients/teams";
import url from "../../utilities/url";

export const fetchGroupRequest = id => dispatch => {
    dispatch(actions.loadGroupProgress());
    teams
        .getGroup(id)
        .then(response => {
            dispatch(actions.loadGroupSuccess(response));
        })
        .catch(error => {
            dispatch(actions.loadGroupFailure());
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const updateGroupRequest = (id, body) => dispatch => {
    dispatch(actions.updateGroupProgress());
    teams
        .updateGroup(id, body)
        .then(response => {
            dispatch(actions.updateGroupSuccess(response));
            dispatch(push(url.resolve("../", true)));
            notifications.add({ type: "positive", message: `Group "${response.name}" updated successfully`, autoDismiss: 5000 });
        })
        .catch(error => {
            dispatch(actions.updateGroupFailure());
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const deleteGroupRequest = id => dispatch => {
    dispatch(actions.deleteGroupProgress());
    teams
        .deleteGroup(id)
        .then(response => {
            dispatch(actions.deleteGroupSuccess());
            dispatch(push(url.resolve("../", true)));
            notifications.add({ type: "positive", message: `Group "${response.name}" removed successfully`, autoDismiss: 5000 });
        })
        .catch(error => {
            dispatch(actions.deleteGroupFailure());
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
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
