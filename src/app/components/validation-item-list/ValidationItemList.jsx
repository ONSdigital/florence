import React, { Component } from "react";
import PropTypes from "prop-types";
import ValidationItem from "./ValidationItem";
import { is } from "../../../../../../../Library/Caches/typescript/4.3/node_modules/@babel/types/lib/index";

const propTypes = {
    ruleStates: PropTypes.shape({
        stringLenght: PropTypes.bool,
        upperCase: PropTypes.bool,
        lowerCase: PropTypes.bool,
        numberPresence: PropTypes.bool
    })
};

export default class ValidationItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validationRules: [
                {
                    name: "14 characters",
                    checked: this.props.ruleStates.stringLenght,
                    id: "minimum-character-limit",
                    enabled: true
                },
                {
                    name: "1 uppercase character",
                    checked: this.props.ruleStates.upperCase,
                    id: "uppercase-character-validation",
                    enabled: true
                },
                {
                    name: "1 lowercase character",
                    checked: this.props.ruleStates.lowerCase,
                    id: "lowercase-character-validation",
                    enabled: true
                },
                {
                    name: "1 number",
                    checked: this.props.ruleStates.numberPresence,
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
                    let isChecked = false;
                    switch (rule.id) {
                        case "minimum-character-limit": {
                            isChecked = this.props.ruleStates.stringLenght;
                            break;
                        }
                        case "uppercase-character-validation": {
                            isChecked = this.props.ruleStates.upperCase;
                            break;
                        }
                        case "lowercase-character-validation": {
                            isChecked = this.props.ruleStates.lowerCase;
                            break;
                        }
                        case "minimum-number-limit": {
                            isChecked = this.props.ruleStates.numberPresence;
                            break;
                        }
                    }
                    return <ValidationItem key={rule.id} name={rule.name} checked={isChecked} id={rule.id} enabled={rule.enabled} />;
                })}
                <p>It could be a phrase that has more than 14 characters. For example, 1bought11cupsoftea.</p>
                <p>It can also have special chracters, for example £,?,!,%,&.</p>
            </div>
        );
    }
}

ValidationItemList.propTypes = propTypes;
