import React from "react";
import PropTypes from "prop-types";
import SelectedItem from "./SelectedItem";

const SelectedItemList = ({ items, removeClassNames, classNames, handleRemoveItem }) => (
    <div className="selected-item-list">
        {items.map((selectedItem, index) => (
            <SelectedItem key={index} removeClassNames={removeClassNames} classNames={classNames} {...selectedItem} handleRemoveItem={handleRemoveItem} />
        ))}
    </div>
);

SelectedItemList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    classNames: PropTypes.string,
    removeClassNames: PropTypes.string,
    handleRemoveItem: PropTypes.func,
};

export default SelectedItemList;
