import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Item = ({ id, selectableBox, status, handleClick, isSelected }) => (
    <li
        id={id}
        className={clsx('selectable-box__item', {"selected" : isSelected})}
        onClick={() => handleClick(id)}
    >
        <div className="grid">
            <div className="grid__col-6">
                {selectableBox.firstColumn}
                {status.message && ` [${status.message}]`}
            </div>
            <div className="grid__col-6">{selectableBox.secondColumn}</div>
        </div>
    </li>
);

Item.propTypes = {
    id: PropTypes.any.isRequired,
    selectableBox: PropTypes.shape({
        firstColumn: PropTypes.string.isRequired,
        secondColumn: PropTypes.string.isRequired,
    }),
    status: PropTypes.shape({
        neutral: PropTypes.bool.isRequired,
        warning: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
    }),
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
};

export default Item;
