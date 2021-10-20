import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const NotificationItem = ({ isVisible = false, type, message, buttons = [] }) => (
    <li className={clsx("notifications__item", { visible: isVisible }, `notifications__item--${type}`)}>
        {message}
        {buttons.map((button, i) => {
            return (
                <button key={`button${i}`} className="notifications__button" onClick={button.onClick}>
                    {button.text}
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
        })
    ),
};

export default NotificationItem;
