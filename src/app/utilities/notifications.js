import { addNotification, removeNotification, toggleNotificationVisibility } from "../config/actions";
import React, { Fragment } from "react";
import { store } from "../config/store";
import log from "./logging/log";

import uuid from "uuid/v4";

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
                icon: (
                    <svg
                        className="svg-icon--hide-notification"
                        viewBox="0 0 14 14"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Hide icon"
                    >
                        <path
                            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                            fill="#FFFFFF"
                        />
                    </svg>
                ),
                onClick: function() {
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
