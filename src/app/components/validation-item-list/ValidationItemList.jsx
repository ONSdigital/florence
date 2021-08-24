import React, { Component } from "react";
import PropTypes from "prop-types";
import ValidationItem from "./ValidationItem";

const propTypes = {
    validationRules: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            checked: PropTypes.bool,
            id: PropTypes.string,
            enabled: PropTypes.bool
        })
    )
};

export default class ValidationItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="margin-bottom--1">
                {this.props.validationRules.map(rule => {
                    let isChecked = rule.checked;

                    return <ValidationItem key={rule.id} name={rule.name} checked={isChecked} id={rule.id} enabled={rule.enabled} />;
                })}
                <p className="margin-top--1 margin-bottom--1">
                    It could be a phrase that has more than 14 characters. For example, 1bought11cupsoftea.
                </p>
                <p>It can also have special chracters, for example £,?,!,%,&.</p>
            </div>
        );
    }
}

ValidationItemList.propTypes = propTypes;
