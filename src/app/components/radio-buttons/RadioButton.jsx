import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    inline: PropTypes.bool,
    disabled: PropTypes.bool,
    subLabel: PropTypes.string,
};

export default class RadioButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            checked: props.checked,
        };
    }

    handleChange = event => {
        const checked = event.target.checked;
        const id = this.props.id;
        const value = this.props.value;
        const onChange = this.props.onChange;
        if (onChange) {
            onChange({ id, checked, value });
        }
    };

    handleFocus = () => {
        this.setState({ focused: true });
    };

    handleBlur = () => {
        this.setState({ focused: false });
    };

    render() {
        return (
            <div className={"radio" + (this.props.inline ? " radio--inline" : "")}>
                <input
                    className={"radio__input" + (this.props.checked ? " selected" : "") + (this.state.focused ? " focused" : "")}
                    type="radio"
                    name={this.props.group}
                    checked={this.props.checked}
                    value={this.props.value}
                    id={this.props.id}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    disabled={this.props.disabled}
                />

                <label
                    className={
                        "radio__label" +
                        (this.props.checked ? " radio__label--selected" : "") +
                        (this.state.focused ? " radio__label--focused" : "") +
                        (this.props.disabled ? " radio__label--disabled" : "")
                    }
                    htmlFor={this.props.id}
                >
                    {this.props.label}{" "}
                    {this.props.subLabel ? (
                        <span className="sub-label">
                            <br />
                            {this.props.subLabel}
                        </span>
                    ) : null}
                </label>
            </div>
        );
    }
}

RadioButton.propTypes = propTypes;
