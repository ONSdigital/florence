import React, { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    onClearValue: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.string,
    fileError: PropTypes.string,
    displayInputAsErrored: PropTypes.bool,
    disabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    inline: PropTypes.bool,
    accept: PropTypes.string,
    value: PropTypes.string,
    helpMessage: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    allowAutoComplete: PropTypes.bool,
    placeholder: PropTypes.string,
    disableShowPasswordText: PropTypes.bool,
    reverseLabelOrder: PropTypes.bool,
};

const defaultProps = {
    type: "text",
    disabled: false,
    isFocused: false,
};

export default class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
            displayShowHide: (!this.props.disableShowPasswordText && this.props.type) === "password",
        };
    }

    showHide = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            type: this.state.type === "text" ? "password" : "text",
        });
    };

    moveCaretToEnd = event => {
        // Move caret to the end of the value on input focus
        const val = event.target.value;
        event.target.value = "";
        event.target.value = val;
    };

    getFormClasses() {
        let formClasses = "form__input";
        if (this.props.error || this.props.displayInputAsErrored) {
            formClasses += " form__input--error";
        }
        if (this.props.inline) {
            formClasses += " form__input--flush";
        }
        if (this.props.type === "checkbox") {
            formClasses += " checkbox";
        }
        return formClasses;
    }

    getInputClasses() {
        let inputClasses = "input";
        if (this.state.displayShowHide) {
            inputClasses += " input--show-hide";
        }
        if (this.props.type === "checkbox") {
            inputClasses += " checkbox__input visually-hidden";
        }
        return inputClasses;
    }

    renderInput() {
        switch (this.props.type) {
            case "textarea":
                return (
                    <textarea
                        id={this.props.id}
                        className="input input__textarea"
                        name={this.props.name || this.props.id}
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                        autoFocus={this.props.isFocused}
                        placeholder={this.props.inline && this.props.label}
                        value={this.props.value}
                    />
                );
            case "clear":
                return (
                    <span className="deleteIcon">
                        <input
                            id={this.props.id}
                            type="text"
                            className={this.getInputClasses()}
                            name={this.props.name || this.props.id}
                            disabled={this.props.disabled}
                            onChange={this.props.onChange}
                            onBlur={this.props.onBlur}
                            autoFocus={this.props.isFocused}
                            onFocus={this.moveCaretToEnd}
                            placeholder={this.props.inline ? this.props.label : this.props.placeholder}
                            accept={this.props.accept}
                            value={this.props.value}
                            min={this.props.min}
                            max={this.props.max}
                            autoComplete={!this.props.allowAutoComplete && "new-password"}
                        />
                        <span onClick={this.props.onClearValue}>x</span>
                    </span>
                );
            default:
                return (
                    <input
                        id={this.props.id}
                        /* If using old 'Show' within input then use 'state' as it is managed within the input component
                         * otherwise use the prop which is managed by the parent */
                        type={this.state.displayShowHide ? this.state.type : this.props.type}
                        className={this.getInputClasses()}
                        name={this.props.name || this.props.id}
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                        autoFocus={this.props.isFocused}
                        onFocus={this.moveCaretToEnd}
                        placeholder={this.props.inline ? this.props.label : this.props.placeholder}
                        accept={this.props.accept}
                        value={this.props.value}
                        min={this.props.min}
                        max={this.props.max}
                        // setting autocomplete to "new-password" will/should tell Google this is a
                        //  "sign up form" type of input and not use the auto complete, more info:
                        // https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands
                        autoComplete={!this.props.allowAutoComplete && "new-password"}
                    />
                );
        }
    }

    renderLabel() {
        return (
            <label className={clsx("form__label", { "checkbox__label font-weight--300": this.props.type === "checkbox" })} htmlFor={this.props.id}>
                {this.props.label}
            </label>
        );
    }

    render() {
        const formClasses = this.getFormClasses();
        return (
            <div className={formClasses}>
                {!this.props.inline && !this.props.reverseLabelOrder && this.renderLabel()}
                {this.props.error && (
                    <div id={`input-error-${this.props.id}`} data-testid={this.props.id} className="error-msg" role="alert">
                        {this.props.error}
                    </div>
                )}
                {this.props.helpMessage && <div className="help-msg">{this.props.helpMessage}</div>}
                {this.props.fileError && (
                    <div id={`input-error-${this.props.id}`} data-testid={this.props.id} className="error-msg" role="alert">
                        {this.props.fileError}
                    </div>
                )}
                {this.renderInput()}
                {this.state.displayShowHide && (
                    <span className="btn btn--password" onClick={this.showHide} onKeyPress={this.showHide} tabIndex="0" role="button">
                        {this.state.type === "text" ? "Hide" : "Show"}
                    </span>
                )}
                {this.props.inline && this.props.reverseLabelOrder && this.renderLabel()}
            </div>
        );
    }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;
