import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const DoubleSelectableBoxItem = ({ id, isSelected, status, selectableBox, handleClick }) => (
    <li
        id={id}
        data-testid={id}
        className={clsx("selectable-box__item", { selected: isSelected }, { neutral: status?.neutral }, { warning: status?.warning })}
        onClick={() => handleClick(id)}
    >
        <div className="grid">
            <div className="grid__col-6">
                {selectableBox.firstColumn}
                {status.message && `[${status.message}]`}
            </div>
            <div className="grid__col-6">{selectableBox.secondColumn}</div>
        </div>
    </li>
);

DoubleSelectableBoxItem.propTypes = {
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

export default DoubleSelectableBoxItem;
