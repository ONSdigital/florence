import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    onRemoveItem: PropTypes.func.isRequired
};
export default class SelectedItem extends Component {
    handleRemoveClick = () => {
        this.props.onRemoveItem(this.props.item);
    };

    render() {
        return (
            <span className="selected-item-list__item">
                {this.props.item.name}
                <button className="selected-item-list__remove" type="button" onClick={this.handleRemoveClick}>
                    ×
                </button>
            </span>
        );
    }
}

SelectedItem.propTypes = propTypes;
