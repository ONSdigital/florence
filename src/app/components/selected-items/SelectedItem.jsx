import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function SelectedItem({ id, name, removeClassNames, classNames, onRemoveItem }) {
    const handleRemoveClick = () => {
        onRemoveItem(id);
    };

    return (
        <span className={clsx("selected-item-list__item", classNames)}>
            {name}
            <button className={clsx("selected-item-list__remove", removeClassNames)} type="button" onClick={handleRemoveClick}>
                ×
            </button>
        </span>
    );
}

SelectedItem.PropTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    classNames: PropTypes.string,
    removeClassNames: PropTypes.string,
};

export default SelectedItem;
