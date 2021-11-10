import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Item = ({ id, name, status, type, handleClick, isSelected, publishDate }) => (
    <li id={id} className={clsx("selectable-box__item", { selected: isSelected })} onClick={() => handleClick(id)}>
        <div className="grid">
            <div className="grid__col-6">
                {name}
                {status && status.message && ` [${status.message}]`}
            </div>
            <div className="grid__col-6">{publishDate ? publishDate : `[${type} collection]`}</div>
        </div>
    </li>
);

Item.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string, 
    status: PropTypes.shape({
        neutral: PropTypes.bool.isRequired,
        warning: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
    }),
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
};

export default Item;
