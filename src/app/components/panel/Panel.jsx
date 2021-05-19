import React from "react";
import PropTypes from "prop-types";

// Types: warning, error, announcement, information, success, bare
const propTypes = {
    type: PropTypes.string.isRequired,
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    heading: PropTypes.string,
    bannerHeading: PropTypes.bool,
    icon: PropTypes.oneOf(["exclamation", "tick", "arrow"]),
    input: PropTypes.shape({
        label: PropTypes.string,
        type: PropTypes.string,
        id: PropTypes.string,
        pattern: PropTypes.string,
        inputMode: PropTypes.string,
        required: PropTypes.bool
    })
};
const Panel = props => {
    let panelClass = `panel`;
    panelClass += ` panel--${props.type}`;
    panelClass += props.bannerHeading ? `` : ` panel--no-title`;

    const headingSection = (
        <div className={"panel__header"}>
            <h2 id="error-summary-title" data-qa="header" className="panel__title">
                {props.heading}
            </h2>
        </div>
    );
    const tickSVG = (
        <svg className="svg-icon" viewBox="0 0 13 10" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <path
                d="M14.35,3.9l-.71-.71a.5.5,0,0,0-.71,0h0L5.79,10.34,3.07,7.61a.51.51,0,0,0-.71,0l-.71.71a.51.51,0,0,0,0,.71l3.78,3.78a.5.5,0,0,0,.71,0h0L14.35,4.6A.5.5,0,0,0,14.35,3.9Z"
                transform="translate(-1.51 -3.04)"
            />
        </svg>
    );
    const arrowSVG = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path
                d="M4.2,12c0-0.6,0.4-1,1-1h11.2l-4.9-4.9c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l6.6,6.6c0.4,0.4,0.4,1,0,1.4l-6.6,6.6c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l4.9-4.9H5.2C4.7,13,4.2,12.6,4.2,12z"
                fill="currentColor"
            />
        </svg>
    );

    let iconSection;
    switch (props.icon) {
        case "tick":
            iconSection = <span className="panel__icon">{tickSVG}</span>;
            break;
        case "arrow":
            iconSection = (
                <span className="panel__icon" aria-hidden="true">
                    {arrowSVG}
                </span>
            );
            break;
        case "exclamation":
            iconSection = (
                <span className="panel__icon" aria-hidden="true">
                    !
                </span>
            );
            break;
    }
    let bodySection = (
        <div className="panel__body">
            {props.heading && !props.bannerHeading && (
                <p className={"panel__" + props.type}>
                    <strong className={"font-weight--600"}>{props.heading}</strong>
                </p>
            )}
            {props.body}
        </div>
    );
    let inputSection;
    if (props.input != null) {
        inputSection = (
            <div className="field">
                <label className="label  " htmlFor="number">
                    {props.input.label}
                </label>
                <input
                    type={props.input.type}
                    id={props.input.id}
                    className={`input input--text input-type__input  input--props.type`}
                    pattern={props.input.pattern}
                    inputMode={props.input.inputMode}
                    required={props.input.required}
                />
            </div>
        );
    }

    //______________________________________________________________________
    //{props.heading && props.bannerHeading && headingSection}
    //                     {props.input && inputSection}
    //______________________________________________________________________
    return (
        <div className={props.type}>
            <div className={props.type === "announcement" ? "padding-right--1 padding-left--1" : ""}>
                <div className={panelClass}>
                    {props.heading && props.bannerHeading && headingSection}
                    {props.icon && iconSection}
                    <span className="visually-hidden">{props.type}</span>
                    {props.body && bodySection}
                    {props.input && inputSection}
                </div>
            </div>
        </div>
    );
};
Panel.propTypes = propTypes;
export default Panel;
