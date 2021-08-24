import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    name: PropTypes.string,
    checked: PropTypes.bool,
    id: PropTypes.string,
    enabled: PropTypes.bool
};

export default class ValidationItem extends Component {
    constructor(props) {
        super(props);
    }
    preventUserInteractions(e) {
        e.preventDefault();
    }

    render() {
        const inputElements = (
            <input
                type="checkbox"
                id={this.props.id}
                checked={this.props.checked}
                onClick={this.preventUserInteractions}
                onKeyDown={this.preventUserInteractions}
                className="readonly-checkbox"
            ></input>
        );

        const labelElements = <label htmlFor={this.props.id}> {this.props.name}</label>;

        return (
            <div className="readonly-checkbox__wrapper">
                {this.props.enabled && inputElements}
                {this.props.enabled && labelElements}
            </div>
        );
    }
}

ValidationItem.propTypes = propTypes;
