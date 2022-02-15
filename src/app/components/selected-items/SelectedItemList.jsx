import React from "react";
import PropTypes from "prop-types";
import SelectedItem from "./SelectedItem";

const SelectedItemList = props => (
    <div className="selected-item-list">
        {props.items.map((selectedItem, index) => (
            <SelectedItem key={index} {...selectedItem} />
        ))}
    </div>
);

SelectedItemList.PropTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    classNames: PropTypes.string,
    onRemoveItem: PropTypes.func.isRequired,
    removeClassName: PropTypes.string,
};

export default SelectedItemList;
