import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.any.isRequired,
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
};

export default class SelectableBoxItem extends Component {
    bindClick = () => {
        this.props.handleClick(this.props);
    };

    render() {
        return (
            <li id={this.props.id} className={`selectable-box__item ${this.props.isSelected ? "selected" : ""}`} onClick={this.bindClick}>
                {this.props.name}
            </li>
        );
    }
}

SelectableBoxItem.propTypes = propTypes;
