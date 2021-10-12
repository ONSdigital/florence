import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    contents: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            disabled: PropTypes.bool,
            isGroup: PropTypes.bool,
            groupOptions: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                    disabled: PropTypes.bool,
                })
            ),
        })
    ).isRequired,
    name: PropTypes.string,
    selectedOption: PropTypes.string,
    defaultOption: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    disabled: PropTypes.bool,
};

const defaultProps = {
    disabled: false,
};

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFocused: false,
        };
    }

    handleFocus = () => {
        this.state.isFocused ? this.setState({ isFocused: false }) : this.setState({ isFocused: true });
    };

    renderOptions = options => {
        return options.map((option, index) => {
            if (option.isGroup) {
                return (
                    <optgroup label={option.name} key={index}>
                        {option.groupOptions.map((groupOption, index) => {
                            return (
                                <option disabled={groupOption.disabled} key={`${option.name}-${index}`} value={groupOption.id}>
                                    {groupOption.name}
                                </option>
                            );
                        })}
                    </optgroup>
                );
            }
            return (
                <option disabled={option.disabled} key={index} value={option.id}>
                    {option.name}
                </option>
            );
        });
    };

    render() {
        return (
            <div className={"form__input" + (this.props.error ? " form__input--error" : "")}>
                <label className="form__label" htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                {this.props.error && <div className="error-msg">{this.props.error}</div>}
                <div
                    className={
                        "select-wrap " +
                        (this.state.isFocused ? "select-wrap--focus" : "") +
                        (this.props.error ? "select-wrap--error" : "") +
                        (this.props.disabled ? "select-wrap--disabled" : "")
                    }
                >
                    <select
                        className="select"
                        id={this.props.id}
                        name={this.props.name || this.props.id}
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleFocus}
                        value={this.props.selectedOption}
                    >
                        <option value="default-option">{this.props.defaultOption || "Select an option"}</option>
                        {this.renderOptions(this.props.contents)}
                    </select>
                </div>
            </div>
        );
    }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;
export default Select;
