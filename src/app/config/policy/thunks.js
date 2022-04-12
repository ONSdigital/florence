import { push } from "react-router-redux";
import * as actions from "./actions";
import collections from "../utilities/api-clients/collections";
import notifications from "../utilities/notifications";
import { errCodes } from "../utilities/errorCodes";

export const fetchPolicyRequest = id => async dispatch => {
    dispatch(actions.loadPolicyProgress());
    try {
        const result = await collections.getPolicy(id);
        dispatch(actions.loadPolicySuccess(result));
    } catch (error) {
        dispatch(actions.loadPolicyFailure());
        switch (error.status) {
            case 401: {
                break;
            }
            case 400: {
                const notification = {
                    type: "warning",
                    message: "There was an error getting the collection data. Please try again.",
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
                    message: `An unexpected error has occurred whilst getting collection data`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
        }
        console.error(error);
    }
};

export const updatePolicyRequest = (id, body) => dispatch => {
    dispatch(actions.updatePolicyProgress());
    try {
        const result = await collections.updatePolicy(id, body);
        dispatch(actions.uploadPolicySuccess(result));
    } catch (error) {
        dispatch(actions.uploadPolicyFailure());
        switch (error.status) {
            case 401: {
                break;
            }
            case 400: {
                const notification = {
                    type: "warning",
                    message: "There was an error updating the collection data. Please try again.",
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
                    message: `An unexpected error has occurred whilst updating collection data`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
        }
        console.error(error);
};
