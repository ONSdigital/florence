import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            onClick: PropTypes.func.isRequired,
            text: PropTypes.string.isRequired,
            style: PropTypes.oneOf(["standard", "positive", "primary", "warning", "subtle", "invert-primary"]),
        })
    ),
};

const PopoutItem = props => (
    <div>
        <div className="modal__header">
            <h1 className="modal__title">{props.title}</h1>
        </div>
        <div className="modal__body">
            {props.body}
            <div className="modal__button-container">
                {props.buttons.map((button, i) => {
                    const buttonClasses = clsx("btn", "btn--margin-right", {
                        [`btn--${button.style}`]: button.style && button.style !== "standard",
                    });
                    return (
                        <button key={`button--${i}`} className={buttonClasses} onClick={button.onClick}>
                            {button.text}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
);

PopoutItem.propTypes = propTypes;
export default PopoutItem;
