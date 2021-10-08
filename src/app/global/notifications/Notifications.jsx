import React from "react";
import PropTypes from "prop-types";

import NotificationItem from "./NotificationItem";

const propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.object)
};

const Notifications = ({ notifications }) => {
    return (
        <ul className="notifications">
            {notifications.map(notification => {
                return <NotificationItem {...notification} key={notification.id} />;
            })}
        </ul>
    );
};

Notifications.propTypes = propTypes;

export default Notifications;
