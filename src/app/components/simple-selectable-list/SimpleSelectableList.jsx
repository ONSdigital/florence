import React from "react";
import PropTypes from "prop-types";
import SimpleSelectableListItem from "./SimpleSelectableListItem";

const SimpleSelectableList = props => {
    const showLoadingState = props.showLoadingState;
    const hasRows = !!props.rows?.length;
    const colCount = hasRows && props.rows[0].extraDetails ? props.rows[0].extraDetails.length + 1 : 1;

    return (
        <ul className="list list--neutral simple-select-list">
            {hasRows && props.rows.map(row => <SimpleSelectableListItem key={row.id} colCount={colCount} {...row} />)}
            {showLoadingState && <span data-testid="loader" className="margin-top--1 loader loader--dark" />}
            {!hasRows && !showLoadingState && <p className="padding-top--1">Nothing to show.</p>}
        </ul>
    );
};
SimpleSelectableList.propTypes = {
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            externalLink: PropTypes.bool,
            details: PropTypes.arrayOf(PropTypes.string),
            extraDetails: PropTypes.arrayOf(
                PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.oneOfType[(PropTypes.string, PropTypes.object)], classes: PropTypes.string }))
            ),
        })
    ).isRequired,
    showLoadingState: PropTypes.bool,
};
export default SimpleSelectableList;
