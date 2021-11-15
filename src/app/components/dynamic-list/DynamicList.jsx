import React from "react";
import DynamicListItem from "./DynamicListItem";
import PropTypes from "prop-types";
import Input from "../Input";

const propTypes = {
    title: PropTypes.string.isRequired,
    listHeightClass: PropTypes.string,
    filterPlaceholder: PropTypes.string,
    noResultsText: PropTypes.string,
    handleSearchInput: PropTypes.func,
    listItems: PropTypes.arrayOf(PropTypes.shape(DynamicListItem.propTypes)).isRequired,
};

const DynamicList = props => {
    const searchID = `${props.title.replace(/\s+/g, "-").toLowerCase()}-search-content-types`;
    let list;
    if (props.listItems.length > 0) {
        list = (
            <ul className={`dynamic-list__container ${props.listHeightClass}`}>
                {props.listItems.map((row, index) => {
                    return <DynamicListItem key={`dynamic-list-row-${index}`} {...row} />;
                })}
            </ul>
        );
    } else {
        list = <div role="alert">{props.noResultsText}</div>;
    }
    return (
        <div>
            <span className="dynamic-list__title">{props.title}</span>
            {props.handleSearchInput && (
                <>
                    <label htmlFor={searchID} className="visually-hidden">
                        {props.filterPlaceholder}
                    </label>
                    <Input id={searchID} placeholder={props.filterPlaceholder} onChange={props.handleSearchInput} />
                </>
            )}
            {list}
        </div>
    );
};

DynamicList.propTypes = propTypes;
export default DynamicList;
