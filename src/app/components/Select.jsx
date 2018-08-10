import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    contents: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            disabled: PropTypes.bool
        })]
    )).isRequired,
    selectedOption: PropTypes.string,
    defaultOption: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    disabled: PropTypes.bool
};

const defaultProps = {
    disabled: false,
};

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFocused: false
        };

        this.handleFocus = this.handleFocus.bind(this);
    }

    handleFocus() {
        this.state.isFocused ? this.setState({isFocused: false}) : this.setState({isFocused: true})
    }

    render() {
        return (
            <div className={"form__input" + (this.props.error ? " form__input--error" : "")}>
                <label className="form__label" htmlFor={this.props.id}>{this.props.label}</label>
                {this.props.error &&
                <div className="error-msg">{this.props.error}</div>
                }
                <div className={"select-wrap " + (this.state.isFocused ? "select-wrap--focus" : "") + (this.props.error ? "select-wrap--error" : "") + (this.props.disabled ? "select-wrap--disabled" : "")}>
                    <select
                        className="select"
                        id={this.props.id}
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleFocus}
                        value={this.props.selectedOption}
                    >
                        <option value="default-option">{this.props.defaultOption || "Select an option"}</option>
                        {this.props.contents.map((item, index) => {
                            return <option disabled={item.disabled} key={index} value={item.id || item}>{item.name || item}</option>
                        })}
                    </select>
                </div>
            </div>
        )
    }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;
export default Select;