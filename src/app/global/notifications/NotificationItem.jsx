import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    type: PropTypes.oneOf(["neutral", "warning"]).isRequired,
    message: PropTypes.string,
    id: PropTypes.string.isRequired,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired
    })),
    isVisible: PropTypes.bool
}

const defaultProps = {
    isVisible: false,
    buttons: []
}

class NotificationItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className={`notifications__item ${this.props.isVisible ? "visible" : ""} ${this.props.type === "warning" ? "notifications__item--warning" : ""}`}>
                {this.props.message}
                {this.props.buttons.map((button, index) => {
                    return ( 
                        <button 
                            key={index} 
                            className="notifications__button" 
                            onClick={button.onClick}
                        >
                            {button.text}
                        </button>
                    )
                })}
            </li>
        )
    }
}

NotificationItem.propTypes = propTypes;
NotificationItem.defaultProps = defaultProps;

export default NotificationItem;