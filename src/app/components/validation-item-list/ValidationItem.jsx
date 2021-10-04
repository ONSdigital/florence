import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    name: PropTypes.string,
    checked: PropTypes.bool,
    id: PropTypes.string
};

export default class ValidationItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="readonly-checkbox__wrapper">
                <input type="checkbox" id={this.props.id} checked={this.props.checked} disabled="disabled" className="readonly-checkbox" />
                <label htmlFor={this.props.id}> {this.props.name}</label>
            </div>
        );
    }
}

ValidationItem.propTypes = propTypes;
