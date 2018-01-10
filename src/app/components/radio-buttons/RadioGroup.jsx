import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radio from './RadioButton';

const propTypes = {
    radioData: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    legend: PropTypes.string,
    groupName: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    selectedValue: PropTypes.string,
    inline: PropTypes.bool
};

export default class RadioGroup extends Component {
    constructor(props) {
        super(props);

        //this.state = {selectedValue: ""};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

    render() {
        const radioData = this.props.radioData;
        const groupName = this.props.groupName;
        const selectedValue = this.props.selectedValue;

        return (
            <fieldset className="fieldset">
                {this.props.legend ? <legend>{this.props.legend}</legend> : ""}
                {
                    radioData.map((radio, index) => {
                        return <Radio inline={this.props.inline} key={index} {...radio} group={groupName} onChange={this.handleChange} checked={selectedValue === radio.value}/>
                    })
                }
            </fieldset>
        )
    }
}

RadioGroup.propTypes = propTypes;