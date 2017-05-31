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
     *      isDismissable [Bool]
     *      buttons [Array of objects]
     * }
     */
    static add(notification) {
        const config = {
            type: notification.type || "neutral",
            message: notification.message || "",
            id: notification.id || Date.now(),
            buttons: notification.buttons || []
        }

        if (notification.autoDismiss && notification.autoDismiss > 0) {
            const timer = window.setTimeout(() => {
                window.clearTimeout(timer);
                this.remove(config.id);
            }, notification.autoDismiss);
        }

        if (notification.isDismissable) {
            config.buttons.push({
                text: "Close",
                onClick: function() {
                    notifications.remove(config.id)
                }
            });
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