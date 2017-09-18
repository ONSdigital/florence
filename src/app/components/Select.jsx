import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    contents: PropTypes.array.isRequired,
    defaultOption: PropTypes.string,
    onChange: PropTypes.func
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
            <div className="form__input">
                <label className="form__label" htmlFor={this.props.id}>{this.props.label}</label>
                <div className={"select-wrap " + (this.state.isFocused ? "select-wrap--focus" : "")}>
                    <select
                        className="select"
                        id={this.props.id}
                        onChange={this.props.onChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleFocus}>
                        <option>{this.props.defaultOption || "Select an option"}</option>
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