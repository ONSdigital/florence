import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const NotificationItem = props => (
    <li
        key={props.id + props.type}
        className={clsx("notifications__item", { visible: props.isVisible }, `notifications__item--${props.type}`)}
        data-testid={props.id + props.type}
    >
        {props.message}
        {props.buttons.map((button, i) => {
            return (
                <button key={`button-${i}`} className="notifications__button" onClick={button.onClick}>
                    {button.text}
                    {button.icon}
                </button>
            );
        })}
    </li>
);

NotificationItem.propTypes = {
    type: PropTypes.oneOf(["neutral", "warning", "positive"]).isRequired,
    id: PropTypes.string.isRequired,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    isVisible: PropTypes.bool,
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            onClick: PropTypes.func.isRequired,
            text: PropTypes.string.isRequired,
            icon: PropTypes.element,
        })
    ),
};

export default NotificationItem;
