import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    contents: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string, 
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })]
    )).isRequired,
    defaultOption: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string
};

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFocused: false
        }

        this.handleFocus = this.handleFocus.bind(this);
    }

    handleFocus() {
        this.state.isFocused ? this.setState({isFocused: false}) : this.setState({isFocused: true})
    }

    render() {
        return (
            <div className={"form__input" + (this.props.error ? " form__input--error" : "")}>
                {this.props.error && 
                    <div className="error-msg">{this.props.error}</div>
                }
                <label className="form__label" htmlFor={this.props.id}>{this.props.label}</label>
                <div className={"select-wrap " + (this.state.isFocused ? "select-wrap--focus" : "") + (this.props.error ? "select-wrap--error" : "")}>
                    <select
                        className="select"
                        id={this.props.id}
                        onChange={this.props.onChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleFocus}>
                        <option value="">{this.props.defaultOption || "Select an option"}</option>
                        {this.props.contents.map((item, index) => {
                            return <option key={index} value={item.id || ""}>{item.name || item}</option>
                        })}
                    </select>
                </div>
            </div>
        )
    }
}

Select.propTypes = propTypes;
export default Select;