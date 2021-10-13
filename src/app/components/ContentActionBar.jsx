import React from "react";

import PropTypes from "prop-types";

const buttonStyle = {
    STANDARD: "standard",
    POSITIVE: "positive",
    PRIMARY: "primary",
    WARNING: "warning",
    SUBTLE: "subtle",
    INVERT_PRIMARY: "invert-primary"
};
const buttonStyleArray = Object.values(buttonStyle);
const propTypes = {
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            interactionCallback: PropTypes.func,
            link: PropTypes.string,
            style: PropTypes.oneOf(buttonStyleArray),
            disabled: PropTypes.bool
        })
    ),
    cancelCallback: PropTypes.func,
    cancelDisabled: PropTypes.bool,
    stickToBottom: PropTypes.bool,
    unsavedChanges: PropTypes.bool
};

const ContentActionBar = props => {
    const outerContainerClasses = props.stickToBottom
        ? "grid grid--justify-center content-action-bar content-action-bar--bottom-fixed"
        : "content-action-bar";
    const innerContainerClasses = props.stickToBottom ? "grid__col-10" : "";
    const contentButtons = props.buttons.map((btn, index) => {
        let classes = "btn";
        if (btn.style != null && btn.style !== buttonStyle.STANDARD) {
            classes += ` btn--${btn.style}`;
        }
        classes += index > 0 ? " btn--margin-right btn--margin-left" : "";
        if (btn.interactionCallback != null) {
            return (
                <button id={btn.id} type="button" key={btn.id}onClick={btn.interactionCallback} disabled={btn.disabled} className={classes}>
                    {btn.text}
                </button>
            );
        } else {
            return (
                <a id={btn.id} href={btn.link} className={classes} key={btn.id}>
                    {btn.text}
                </a>
            );
        }
    });
    const unsavedChangesWarning = (
        <span className="content-action-bar__warn">
            <svg className="svg-icon--action-bar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" focusable="false" role="img" aria-label="warning icon">
                <path
                    d="M256,34.297L0,477.703h512L256,34.297z M256,422.05c-9.22,0-16.696-7.475-16.696-16.696s7.475-16.696,16.696-16.696
                            c9.22,0,16.696,7.475,16.696,16.696S265.22,422.05,256,422.05z M239.304,344.137V177.181h33.391v166.956H239.304z"
                />
            </svg>
            <span className="content-action-bar__warn__text"> You have unsaved changes</span>
        </span>
    );
    return (
        <div className={outerContainerClasses}>
            <div className={innerContainerClasses}>
                <div className="padding-bottom--1 padding-top--1">
                    {contentButtons}
                    {props.cancelCallback && (
                        <button
                            id="btn-cancel"
                            type="button"
                            onClick={props.cancelCallback}
                            disabled={props.cancelDisabled}
                            className="btn btn--invert-primary btn--margin-left"
                        >
                            Cancel
                        </button>
                    )}
                    {props.unsavedChanges && unsavedChangesWarning}
                </div>
            </div>
        </div>
    );
};
ContentActionBar.propTypes = propTypes;
export default ContentActionBar;
