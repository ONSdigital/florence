import React from "react";
import PropTypes from "prop-types";
import NotificationItem from "./NotificationItem";

const Notifications = ({ notifications }) => {
    if (notifications.length === 0) return null;

    return (
        <ul className="notifications">
            {notifications.map((notification, i) => (
                <NotificationItem key={notification + i} {...notification} />
            ))}
        </ul>
    );
};

Notifications.propTypes = {
    notifications: PropTypes.array,
};

export default Notifications;
