import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    type: PropTypes.oneOf(["neutral", "warning"]).isRequired,
    message: PropTypes.string,
    id: PropTypes.number.isRequired,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired
    })),
    isVisible: PropTypes.bool
}

class NotificationItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false
        };
    }

    componentDidMount() {
        // Set a timeout so browser doesn't try to render component without the animation
        const animationTimer = window.setTimeout(() => {
            this.setState({isVisible: true});
            window.clearTimeout(animationTimer);
        }, 10);
    }

    render() {
        return (
            <li className={`notifications__item ${this.state.isVisible ? "visible" : ""}`}>
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

export default NotificationItem;