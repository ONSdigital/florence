import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(["neutral", "warning"]).isRequired,
        message: PropTypes.string,
        id: PropTypes.number.isRequired,
        buttons: PropTypes.arrayOf(PropTypes.shape({
            onClick: PropTypes.func.isRequired,
            text: PropTypes.string.isRequired
        }))
    }))
};

class Notifications extends Component {

    renderNotification(notification) {
        return (
            <li key={notification.id} className="notifications__item">
                {notification.message}
                {notification.buttons.map((button, index) => {
                    return ( 
                        <button 
                            key={index} 
                            className="btn notifications__button" 
                            onClick={button.onClick}
                        >
                            {button.text}
                        </button>
                    )
                })}
            </li>
        )
    }

    render() {
        return (
            <ul className="notifications">
                {this.props.notifications.map(notification => {
                    return this.renderNotification(notification)
                })}
            </ul>
        )
    }
}

Notifications.propTypes = propTypes;

export default Notifications;