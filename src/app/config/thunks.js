import { push } from "react-router-redux";
import {
    loadCollectionsProgress,
    loadCollectionsSuccess,
    addNotification,
    createCollection,
    createCollectionSuccess,
    loadCollectionsFailure,
} from "./actions";
import collections from "../utilities/api-clients/collections";
import notifications from "../utilities/notifications";
import { UNEXPECTED_ERR, FETCH_ERR, NOT_FOUND_ERR, PERMISSIONS_ERR } from "../constants/Errors";

export const loadCollectionsRequest = () => (dispatch, getState) => {
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
                    dispatch(push(`/collections`));
                    break;
                }
                case 403: {
                    const notification = {
                        type: "warning",
                        message: PERMISSIONS_ERR("collections"),
                        autoDismiss: 5000,
                    };
                    notifications.add(notification);
                    dispatch(push(`/collections`));
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
