import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

const Sort = ({ active, name }) => {
    const { key, direction } = active;
    const isActive = (name, sortDirection) => {
        if (key === name && direction === sortDirection) return "active";
    };

    return (
        <span className="sort">
            <span data-testid="ASC" className={clsx("sort__icon-up", isActive(name, "ASC"))} />
            <span data-testid="DESC" className={clsx("sort__icon-down", isActive(name, "DESC"))} />
        </span>
    );
};

Sort.propTypes = {
    active: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.oneOf(["ASC", "DESC"]),
    }),
    name: PropTypes.string.isRequired,
};

export default Sort;
