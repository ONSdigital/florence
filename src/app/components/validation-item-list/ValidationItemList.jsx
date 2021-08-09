import React, { Component } from "react";
import PropTypes from "prop-types";
import ValidationItem from "./ValidationItem";

const propTypes = {};

export default class ValidationItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validationRules: [
                {
                    name: "14 characters",
                    checked: false,
                    id: "minimum-character-limit",
                    enabled: true
                },
                {
                    name: "1 uppercase character",
                    checked: false,
                    id: "uppercase-character-validation",
                    enabled: true
                },
                {
                    name: "1 lowercase character",
                    checked: false,
                    id: "lowercase-character-validation",
                    enabled: true
                },
                {
                    name: "1 number",
                    checked: false,
                    id: "minimum-number-limit",
                    enabled: true
                }
            ]
        };
    }

    render() {
        return (
            <div>
                {this.state.validationRules.map(rule => {
                    return <ValidationItem name={rule.name} checked={rule.checked} id={rule.id} />;
                })}
                <p>It could be a phrase that has more than 14 characters. For example, 1bought11cupsoftea.</p>
                <p>It can also have special chracters, for example £,?,!,%,&.</p>
            </div>
        );
    }
}

ValidationItemList.propTypes = propTypes;
