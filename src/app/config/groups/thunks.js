import { push } from "react-router-redux";
import * as actions from "./actions";
import notifications from "../../utilities/notifications";
import teams from "../../utilities/api-clients/teams";
import url from "../../utilities/url";
import { errCodes } from "../../utilities/errorCodes";

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

export const fetchGroupMembersRequest = id => dispatch => {
    dispatch(actions.loadGroupMembersProgress());
    teams
        .getGroupMembers(id)
        .then(response => {
            dispatch(actions.loadGroupMembersSuccess(response.users));
        })
        .catch(error => {
            dispatch(actions.loadGroupMembersFailure());
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};

export const fetchGroupsRequest = () => dispatch => {
    dispatch(actions.loadGroupsProgress());
    teams
        .getGroups()
        .then(response => {
            dispatch(actions.loadGroupsSuccess(response.groups));
        })
        .catch(error => {
            dispatch(actions.loadGroupsFailure());
            notifications.add({
                type: "warning",
                isDismissable: true,
                autoDismiss: 15000,
                message: error.status === 400 ? errCodes.GET_GROUPS_NOT_FOUND : errCodes.GET_GROUPS_UNEXPECTED_ERROR_SHORT,
            });
            console.error(error);
        });
};

export const updateGroupMembersRequest = (id, body) => dispatch => {
    teams
        .updateGroupMembers(id, body)
        .then(response => {
            dispatch(actions.updateGroupMembersSuccess(response.users));
        })
        .catch(error => {
            if (error) {
                notifications.add({ type: "warning", message: error?.message || error.status, autoDismiss: 5000 });
            }
            console.error(error);
        });
};
