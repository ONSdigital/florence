import { addNotification, removeNotification, toggleNotificationVisibility } from "../config/actions";
import React from "react";
import { store } from "../config/store";
import log from "./logging/log";

import uuid from "uuid/v4";
import Cross from "../icons/Cross";

export default class notifications {
    /**
     * Updates state with new notification
     * @param {object} configuration of notification , as follows:
     * {
     *      type [oneOf(["neutral", "warning"])]
     *      message [String]
     *      autoDismiss [Number]
     *      isDismissable [Bool]
     *      buttons [Array of objects]
     * }
     * @returns {string} unique ID of the generated notification, in case the caller needs to refer to the specific notification itself
     */
    static add(notification) {
        if (!notification) {
            console.warn("Couldn't show notification - no notification data supplied");
            return;
        }

        const { notifications = [] } = store.getState().state || {};
        const isDuplicate = notifications.some(n => n.message === notification.message);
        if (isDuplicate) {
            return;
        }

        const config = {
            type: notification.type || "neutral",
            message: notification.message || "",
            id: uuid(),
            buttons: notification.buttons || [],
            isVisible: false,
            isDismissable: notification.isDismissable != null ? notification.isDismissable : true,
        };

        if (notification.autoDismiss && notification.autoDismiss > 0) {
            const timer = window.setTimeout(() => {
                window.clearTimeout(timer);
                this.remove(config.id);
            }, notification.autoDismiss);
        }

        if (config.isDismissable) {
            config.buttons.push({
                text: "Hide",
                icon: <Cross classes="svg-icon--hide-notification" ariaLabel="Hide icon" fill="#FFFFFF" viewBox="0 0 14 14" />,
                onClick: function () {
                    notifications.remove(config.id);
                },
            });
        }

        log.event("Notification shown", log.data({ type: config.type, message: config.message }));

        store.dispatch(addNotification(config));

        // Set a timeout so browser doesn't try to render component without the animation
        const animationTimer = window.setTimeout(() => {
            store.dispatch(toggleNotificationVisibility(config.id));
            window.clearTimeout(animationTimer);
        }, 50);

        return config.id;
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
