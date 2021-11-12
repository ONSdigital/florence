import React from "react";
import DynamicListItem from "./DynamicListItem";
import PropTypes from "prop-types";
import Input from "../Input";

const propTypes = {
    title: PropTypes.string.isRequired,
    handleSearchInput: PropTypes.func,
    listItems: PropTypes.arrayOf(
        PropTypes.shape(DynamicListItem.propTypes)).isRequired
}

const DynamicList = props => {
    return (
        <div>
            <span className="dynamic-list__title">{props.title}</span>
            {props.handleSearchInput && <Input id="search-content-types" placeholder="Search viewers by name or email" onChange={props.handleSearchInput} />}
            <ul>
                {props.listItems.map((row, index)=>{ return <DynamicListItem key={`dynamicListRow-${index}`}{...row}/>})}
            </ul>
        </div>
    )
};

DynamicList.propTypes = propTypes;
export default DynamicList;
