import React, { Component } from "react";
import PropTypes from "prop-types";
import SelectedItem from "./SelectedItem";

const propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    onRemoveItem: PropTypes.func.isRequired
};

export default class SelectedItemList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="selected-item-list">
                {this.props.items.map((selectedItem, key) => {
                    return <SelectedItem key={key} item={selectedItem} onRemoveItem={this.props.onRemoveItem} />;
                })}
            </div>
        );
    }
}

SelectedItemList.propTypes = propTypes;
