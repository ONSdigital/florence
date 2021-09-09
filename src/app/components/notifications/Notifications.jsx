import React from "react";
import PropTypes from "prop-types";

import NotificationItem from "./NotificationItem";

const Notifications = ({ notifications }) => {
    if (notifications.length < 1) return null;
    return (
        <ul className="notifications">
            {notifications.map(notification => {
                return <NotificationItem {...notification} key={notification.id} />;
            })}
        </ul>
    );
};

Notifications.propTypes = {
    notifications: PropTypes.array
};

export default Notifications;
