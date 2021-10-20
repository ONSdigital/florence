import React, { Component } from "react";
import PropTypes from "prop-types";
import Radio from "./RadioButton";

const propTypes = {
    radioData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    legend: PropTypes.string,
    groupName: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    selectedValue: PropTypes.string,
    disabled: PropTypes.bool,
    showLoadingState: PropTypes.bool,
};

export default class RadioList extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = event => {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    };

    render() {
        const radioData = this.props.radioData;
        const hasRadioData = radioData.length;
        const groupName = this.props.groupName;
        const selectedValue = this.props.selectedValue;
        const showLoadingState = this.props.showLoadingState;

        return (
            <div>
                {hasRadioData ? (
                    <fieldset className="fieldset">
                        {this.props.legend ? <legend className="fieldset__legend">{this.props.legend}</legend> : ""}
                        <ul className="list list--neutral simple-select-list">
                            {radioData.map((radio, index) => {
                                return (
                                    <li key={index} className="simple-select-list__item">
                                        <Radio
                                            inline={false}
                                            key={index}
                                            {...radio}
                                            group={groupName}
                                            onChange={this.handleChange}
                                            checked={selectedValue === radio.value}
                                            disabled={this.props.disabled}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </fieldset>
                ) : null}
                {showLoadingState && <span className="margin-top--1 loader loader--dark" />}
                {!hasRadioData && !showLoadingState ? <p>Nothing to show</p> : ""}
            </div>
        );
    }
}

RadioList.propTypes = propTypes;
