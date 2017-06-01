import { addNotification, removeNotification, toggleNotificationVisibility } from '../config/actions';
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
            id: notification.id || createUID(),
            buttons: notification.buttons || [],
            isVisible: false,
            isDismissable: notification.isDismissable != null ? notification.isDismissable : true
        }

        function createUID() {
            const date = Date.now();
            const IDisDuplicate = store.getState().state.notifications.find(notification => {
                return notification.id === date;
            });

            if (!IDisDuplicate) {
                return date;
            }

            return date+1;
        }

        if (notification.autoDismiss && notification.autoDismiss > 0) {
            const timer = window.setTimeout(() => {
                window.clearTimeout(timer);
                this.remove(config.id);
            }, notification.autoDismiss);
        }

        if (config.isDismissable) {
            config.buttons.push({
                text: "Close",
                onClick: function() {
                    notifications.remove(config.id)
                }
            });
        }

        store.dispatch(addNotification(config));
        
        // Set a timeout so browser doesn't try to render component without the animation
        const animationTimer = window.setTimeout(() => {
            store.dispatch(toggleNotificationVisibility(config.id));
            window.clearTimeout(animationTimer);
        }, 50);
    }

    /**
     * Removes notification from state
     * @param {string} notificationID 
     */
    static remove(notificationID) {
        store.dispatch(toggleNotificationVisibility(notificationID));

        // Set a timeout so browser doesn't try to render component without the animation
        const animationTimer = window.setTimeout(() => {
            store.dispatch(removeNotification(notificationID));
            window.clearTimeout(animationTimer);
        }, 50);
    }

}