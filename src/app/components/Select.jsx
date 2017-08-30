import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    editionsListArray: PropTypes.array,
    editionOverride: PropTypes.bool,
    onChange: PropTypes.func
};

class Select extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value:''
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
    this.props.onChange(event.target.value);
  }

  render() {
    const inputSelect = this.props.editionOverride
      ? <div>
          <h4>Enter a custom edition name</h4>
          <input
            className="input"
            type="text"
            onChange={this.handleChange} />
        </div>
      :
      <div>
        <h4>Select an edition</h4>
        <select
          className="select"
          onChange={this.handleChange}>
          <option>Select</option>
          {this.props.editionsListArray.map((currentEditions, index) => {
            return <option key={index}>{currentEditions}</option>
          })}
        </select>
      </div>;

    return (
      <div className="margin-bottom--2">
        {inputSelect}
      </div>
    )
  }
}

Select.propTypes = propTypes;
export default Select;
