import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string
};

class Checkbox extends React.Component {
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
          <div className="checkbox">
            <input className="margin-right--1 checkbox__input" type="checkbox"
              checked={this.props.isChecked}
              onChange={this.props.onChange}
              onFocus={this.handleFocus}
              onBlur={this.handleFocus}
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
