import React from "react";
import PropTypes from "prop-types";
import SelectedItem from "./SelectedItem";
import clsx from "clsx";

const SelectedItemList = props => (
    <div className={clsx("selected-item-list", props.classNames)}>
        {this.props.items.map((selectedItem, key) => {
            return <SelectedItem key={key} item={selectedItem} onRemoveItem={this.props.onRemoveItem} />;
        })}
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
    onRemoveItem: PropTypes.func.isRequired,
};

export default SelectedItemList;
