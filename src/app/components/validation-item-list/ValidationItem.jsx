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
            <div>
                <input type="checkbox" id={this.props.id} checked={this.props.checked ? "checked" : ""}></input>
                <label for={this.props.id}> {this.props.name}</label>
            </div>
        );
    }
}

ValidationItem.propTypes = propTypes;
