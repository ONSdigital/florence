import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Panel from "../panel/Panel";

const propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    descriptionHint: PropTypes.string,
    error: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
};

const TextArea = props => {
    const charactersRemaining = props.maxLength - props.text.length;
    const textAreaBody = (
        <div className={clsx("form__input", { "form__input--error": props.error })}>
            <label htmlFor={props.name} className="form__label">
                {props.title}
            </label>
            <div>{props.descriptionHint}</div>
            <textarea
                id={props.name}
                name={props.name}
                className="input input__textarea"
                value={props.text}
                placeholder={props.placeholder}
                aria-describedby={`${props.name}-char-limit-remaining`}
                rows={props.rows}
                maxLength={props.maxLength}
                onChange={e => props.handleChange(e.target.value)}
            />
            {props.maxLength && (
                <div id={`${props.name}-char-limit-remaining`}>
                    <strong>You have {charactersRemaining} characters remaining</strong>
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

TextArea.propTypes = propTypes;

export default TextArea;
