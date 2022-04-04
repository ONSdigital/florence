import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function SelectedItem({ id, name, removeClassNames, classNames, handleRemoveItem }) {
    return (
        <span className={clsx("selected-item-list__item", classNames)}>
            {name}
            {!!handleRemoveItem && (
                <button className={clsx("selected-item-list__remove", removeClassNames)} type="button" onClick={() => handleRemoveItem(id)}>
                    &times;
                </button>
            )}
        </span>
    );
}

SelectedItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    handleRemoveItem: PropTypes.func,
    classNames: PropTypes.string,
    removeClassNames: PropTypes.string,
};

export default SelectedItem;
