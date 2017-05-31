import { addNotification, removeNotification } from '../config/actions';
import { store } from '../config/store';

export default class notifications {

    /**
     * Updates state with new notification
     * @param {object} configuration of notification , as follows: 
     * {
     *      id [String]
     *      type [oneOf(["neutral", "warning"])]
     *      message [String]
     *      autoDismiss [Number]
     * }
     */
    static add(notification) {
        const config = {
            type: notification.type,
            message: notification.message,
            id: notification.id || Date.now(),
            autoDismiss: notification.autoDismiss,
            dismissable: notification.dismissable || false
        }

        if (config.autoDismiss && config.autoDismiss > 0) {
            const timer = window.setTimeout(() => {
                window.clearTimeout(timer);
                this.remove(config.id);
            }, config.autoDismiss);
        }

        store.dispatch(addNotification(config));
    }

    /**
     * Removes notification from state
     * @param {string} notificationID 
     */
    static remove(notificationID) {
        store.dispatch(removeNotification(notificationID));
    }

}