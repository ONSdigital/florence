import React from "react";

import PropTypes from "prop-types";
import Warning from "../../icons/Warning";

const propTypes = {
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            interactionCallback: PropTypes.func,
            link: PropTypes.string,
            style: PropTypes.oneOf(["standard", "positive", "primary", "warning", "subtle", "invert-primary"]),
            disabled: PropTypes.bool
        })
    ),
    cancelCallback: PropTypes.func,
    cancelDisabled: PropTypes.bool,
    stickToBottom: PropTypes.bool,
    unsavedChanges: PropTypes.bool
};

const ContentActionBar = props => {
    const contentButtons = props.buttons.map((btn) => {
        let classes = "btn btn--margin-right";
        if (btn.style != null && btn.style !== "standard") {
            classes += ` btn--${btn.style}`;
        }
        if (btn.interactionCallback != null) {
            return (
                <button id={btn.id} type="button" key={btn.id} onClick={btn.interactionCallback} disabled={btn.disabled}
                        className={classes}>
                    {btn.text}
                </button>
            );
        }
        return (
            <a id={btn.id} href={btn.link} className={classes} key={btn.id}>
                {btn.text}
            </a>
        );
    });
    const unsavedChangesWarning = (
        <span className="content-action-bar__warn">
            <Warning classes="svg-icon--action-bar" ariaLabel="warning icon" viewBox="0 0 512 512"/>
            <span className="content-action-bar__warn__text"> You have unsaved changes</span>
        </span>
    );
    return (
        <div className={`content-action-bar ${props.stickToBottom ? "content-action-bar--bottom-fixed" : ""}`}>
                {contentButtons}
                {props.cancelCallback && (
                    <button
                        id="btn-cancel"
                        type="button"
                        onClick={props.cancelCallback}
                        disabled={props.cancelDisabled}
                        className="btn btn--invert-primary"
                    >
                        Cancel
                    </button>
                )}
                {props.unsavedChanges && unsavedChangesWarning}
        </div>
    );
};
ContentActionBar.propTypes = propTypes;
export default ContentActionBar;
