import React, { Component } from "react";
import PropTypes from "prop-types";

import NotificationItem from "./NotificationItem";

const propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.object)
};

class Notifications extends Component {
    render() {
        return (
            <ul className="notifications">
                {this.props.notifications.map(notification => {
                    return <NotificationItem {...notification} key={notification.id} />;
                })}
            </ul>
        );
    }
}

Notifications.propTypes = propTypes;

export default Notifications;
