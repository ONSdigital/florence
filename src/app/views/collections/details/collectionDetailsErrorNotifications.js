import notifications from "../../../utilities/notifications";
/**
 * Methods to handle the errors returned by network requests in the collection details controller component
 */

export default class collectionDetailsErrorNotifications {
    static getActiveCollection(error) {
        switch (error.status) {
            case 401: {
                // do nothing - this is handled by the request function itself
                break;
            }
            case 404: {
                const notification = {
                    type: "neutral",
                    message: `Collection couldn't be found so you've been redirected to the collections screen`,
                    autoDismiss: 5000,
                };
                notifications.add(notification);
                break;
            }
            case 403: {
                const notification = {
                    type: "neutral",
                    message: `You don't have permissions to access this collection so you've been redirect to the collections screen`,
                    autoDismiss: 5000,
                };
                notifications.add(notification);
                break;
            }
            case "FETCH_ERR": {
                const notification = {
                    type: "warning",
                    message: `There was a network error whilst getting this collection, please check your connection and refresh the page`,
                    autoDismiss: 5000,
                };
                notifications.add(notification);
                break;
            }
            default: {
                const notification = {
                    type: "warning",
                    message: "An unexpected error occurred",
                    autoDismiss: 5000,
                };
                notifications.add(notification);
                break;
            }
        }
    }

    static deleteCollection(error) {
        switch (error.status) {
            case 401: {
                // do nothing - this is handled by the request function itself
                break;
            }
            case 400: {
                const notification = {
                    type: "warning",
                    message: `Couldn't delete collection. There may be a file left in progress or awaiting review.`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case 404: {
                const notification = {
                    type: "warning",
                    message: `Couldn't delete collection. It may have already been deleted.`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case 403: {
                const notification = {
                    type: "neutral",
                    message: `You don't have permission to delete collections`,
                    autoDismiss: 5000,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case "FETCH_ERR": {
                const notification = {
                    type: "warning",
                    message: `Couldn't delete collection due to a network error, please check your connection and try again.`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            default: {
                const notification = {
                    type: "warning",
                    message: `Couldn't delete collection due to an unexpected error`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
        }
    }

    static approveCollection(error) {
        switch (error.status) {
            case 401: {
                // Handled by request function
                break;
            }
            case 403: {
                const notification = {
                    type: "neutral",
                    message: `You don't have permission to approve this collection`,
                    autoDismiss: 5000,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case 404: {
                const notification = {
                    type: "warning",
                    message: `Couldn't approve this collection. It may have already been approved or have been deleted`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case "FETCH_ERR": {
                const notification = {
                    type: "warning",
                    message: `Couldn't approve this collection due to a network error, please check your connection and try again`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            default: {
                const notification = {
                    type: "warning",
                    message: `Couldn't approve this collection due to an unexpected error`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
        }
    }

    static deletePage(error, title, collectionName) {
        switch (error.status) {
            case 401: {
                // do nothing - this is handled by the request function itself
                break;
            }
            case 404: {
                const notification = {
                    type: "warning",
                    message: `Couldn't delete the page '${title}' because it doesn't exist in the collection '${collectionName}'`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case 403: {
                const notification = {
                    type: "neutral",
                    message: `You don't have permission to delete the page '${title}' from this collection`,
                    autoDismiss: 5000,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case "FETCH_ERR": {
                const notification = {
                    type: "warning",
                    message: `Couldn't delete the page '${title}' from this collection due to a network error, please check your connection and try again.`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            default: {
                const notification = {
                    type: "warning",
                    message: `Couldn't delete the page '${title}' from this collection due to an unexpected error`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
        }
    }

    static cancelPageDelete(error, uri, collectionName) {
        switch (error.status) {
            case 401: {
                // do nothing - this is handled by the request function itself
                break;
            }
            case 403: {
                const notification = {
                    type: "neutral",
                    message: `You don't have permission to cancel the delete '${uri}'`,
                    autoDismiss: 5000,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case 404: {
                const notification = {
                    type: "warning",
                    message: `Couldn't cancel delete of page '${uri}' because it doesn't exist in the collection '${collectionName}'`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            case "FETCH_ERR": {
                const notification = {
                    type: "warning",
                    message: `Couldn't cancel delete of page '${uri}' due to a network error, please check your connection and try again.`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
            default: {
                const notification = {
                    type: "warning",
                    message: `Couldn't cancel delete of page '${uri}' due to an unexpected error`,
                    isDismissable: true,
                };
                notifications.add(notification);
                break;
            }
        }
    }
}
