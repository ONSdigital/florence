import { push } from "react-router-redux";
import * as actions from "./actions";
import notifications from "../../utilities/notifications";
import { errCodes } from "../../utilities/errorCodes";
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
