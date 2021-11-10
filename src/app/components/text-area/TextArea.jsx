import React from "react";

import PropTypes from "prop-types";
import clsx from "clsx";
import Panel from "../panel/Panel";

const propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    textChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    descriptionHint: PropTypes.string,
    error: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
};

const TextArea = props => {
    const charactersRemaining = props.maxLength - props.text.length;
    const formClasses = clsx("form__input", { "form__input--error": props.error });
    const textAreaBody = (
        <div className={formClasses}>
            <label htmlFor={props.name} className="form__label">
                {props.title}
            </label>
            <div>{props.descriptionHint}</div>
            <textarea
                id={props.name}
                name={props.name}
                className="input input__textarea"
                value={props.text}
                onChange={e => props.textChange(e.target.value)}
                placeholder={props.placeholder}
                aria-describedby={`${props.name}-char-limit-remaining`}
                rows={props.rows}
                maxLength={props.maxLength}
            />
            {props.maxLength && (
                <div id={`${props.name}-char-limit-remaining`}>
                    <b>You have {charactersRemaining} characters remaining</b>
                </div>
            )}
        </div>
    );

    // If there is an error then render the text-area within an error panel
    if (props.error) {
        return <Panel type="error" heading={props.error} body={textAreaBody} />;
    }
    return textAreaBody;
};

const defaultProps = {
    rows: 8,
};

TextArea.propTypes = propTypes;
TextArea.defaultProps = defaultProps;

export default TextArea;
