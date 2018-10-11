import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    contents: PropTypes.array,
    label: PropTypes.string,
    id: PropTypes.string,
    override: PropTypes.bool,
    overrideLabel: PropTypes.string,
    overrideId: PropTypes.string,
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
        const element = this.props.override
            ? <div>
                <label className="form__label" htmlFor={this.props.overrideId}>{this.props.overrideLabel}</label>
                <input
                    className="input"
                    id={this.props.overrideId}
                    type="text"
                    onChange={this.handleChange} />
            </div>
            :
            <div>
                <label className="form__label" htmlFor={this.props.id}>{this.props.label}</label>
                <select
                    className="select"
                    id={this.props.id}
                    onChange={this.handleChange}>
                    <option>Select</option>
                    {this.props.contents.map((list, index) => {
                        return <option key={index}>{list}</option>
                    })}
                </select>
            </div>;

        return (
            <div className="margin-bottom--2">
                {element}
            </div>
        )
    }
}

Select.propTypes = propTypes;
export default Select;