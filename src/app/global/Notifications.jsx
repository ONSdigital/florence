import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(["neutral", "warning"]).isRequired,
        message: PropTypes.string,
        id: PropTypes.number.isRequired
    }))
};

class Notifications extends Component {
    render() {
        return (
            <ul>
                {
                    this.props.notifications.map((notification, index) => {
                        return <li key={index}>{notification.message}</li>
                    })
                }
            </ul>
        )
    }
}

Notifications.propTypes = propTypes;

export default Notifications;