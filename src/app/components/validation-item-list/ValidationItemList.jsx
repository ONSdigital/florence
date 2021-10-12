import React, { Component } from "react";
import PropTypes from "prop-types";
import ValidationItem from "./ValidationItem";

const propTypes = {
    minimumCharacterLimitPassed: PropTypes.bool,
    uppercaseCharacterValidationPassed: PropTypes.bool,
    lowercaseCharacterValidationPassed: PropTypes.bool,
    minimumNumberLimitPassed: PropTypes.bool,
};

export default class ValidationItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="margin-bottom--1">
                <ValidationItem
                    key="minimum-character-limit"
                    name="14 characters"
                    checked={this.props.minimumCharacterLimitPassed}
                    id="minimum-character-limit"
                />
                <ValidationItem
                    key="uppercase-character-validation"
                    name="1 uppercase character"
                    checked={this.props.uppercaseCharacterValidationPassed}
                    id="uppercase-character-validation"
                />
                <ValidationItem
                    key="lowercase-character-validation"
                    name="1 lowercase character"
                    checked={this.props.lowercaseCharacterValidationPassed}
                    id="lowercase-character-validation"
                />
                <ValidationItem key="minimum-number-limit" name="1 number" checked={this.props.minimumNumberLimitPassed} id="minimum-number-limit" />
                <p className="margin-top--1 margin-bottom--1">
                    It could be a phrase that has more than 14 characters. For example, 1bought11cupsoftea.
                </p>
                <p>It can also have special characters, for example £,?,!,%,&.</p>
            </div>
        );
    }
}

ValidationItemList.propTypes = propTypes;
