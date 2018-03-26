import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    isChecked: PropTypes.bool,
    disabled: PropTypes.bool
};

class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFocused: false,
            value: false
        }

        this.handleFocus = this.handleFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        if (this.props.isChecked) {
            this.setState({ value: this.props.isChecked });
        }
    }

    handleChange(event) {
        const isChecked = event.target.checked;
        this.setState({ value: isChecked });
        this.props.onChange(isChecked);
    }

    handleFocus() {
        this.state.isFocused ? this.setState({ isFocused: false }) : this.setState({ isFocused: true })
    }

    render() {
        return (
            <div className={"form__input" + (this.props.error ? " form__input--error" : "")}>
                {this.props.error &&
                    <div className="error-msg">{this.props.error}</div>
                }
                <div className="checkbox">
                    <input className="checkbox__input" type="checkbox"
                        checked={this.state.value}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleFocus}
                        disabled={this.props.disabled}
                        id={this.props.id}
                    />
                    <label htmlFor={this.props.id} className="checkbox__label">
                        {this.props.label}
                    </label>
                </div>
            </div>
        )
    }
}

Checkbox.propTypes = propTypes;
export default Checkbox;
