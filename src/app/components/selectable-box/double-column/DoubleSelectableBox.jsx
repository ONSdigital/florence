import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useSort } from "../../../hooks/useSort";
import Sort from "../../sort";
import DoubleSelectableBoxItem from "./DoubleSelectableBoxItem";

const DoubleSelectableBox = props => {
    const { sortedItems, requestSort, sortConfig } = useSort(props.items, { key: "name", direction: "ASC" });
    const renderList = () => (
        <ul id="selectable-box" className="selectable-box__list" data-testid="selectable-box">
            {sortedItems.map(item => {
                return (
                    <DoubleSelectableBoxItem
                        key={item.id}
                        {...item}
                        isSelected={props.activeItemID && item.id === props.activeItemID}
                        handleClick={props.handleItemClick}
                    />
                );
            })}
        </ul>
    );
    const renderMessage = () => {
        if (props.search) {
            return (
                <div className="selectable-box__message">
                    <p>
                        <strong>Cannot find collection</strong>
                    </p>
                    <p>Improve your results by:</p>
                    <ul>
                        <li>double-checking your spelling</li>
                        <li>searching for something less specific</li>
                    </ul>
                </div>
            );
        } else {
            return (
                <div className="selectable-box__message">
                    <p>No items to display</p>
                </div>
            );
        }
    };

    return (
        <div className="selectable-box">
            <div className="grid">
                <button
                    aria-label="Sort by name"
                    className="selectable-box__heading with-sort grid__col-6 padding-right--0 grid__cell"
                    onClick={() => requestSort("name")}
                >
                    {props.headings[0]}
                    <Sort active={sortConfig} name="name" />
                </button>
                <button
                    aria-label="Sort by publishDate"
                    className="selectable-box__heading with-sort grid__col-6 grid__cell"
                    onClick={() => requestSort("publishDate")}
                >
                    {props.headings[1]}
                    <Sort active={sortConfig} name="publishDate" />
                    {props.isUpdating && <span className="selectable-box__status pull-right loader" />}
                </button>
            </div>
            {props.items.length > 0 ? renderList() : renderMessage()}
        </div>
    );
};

DoubleSelectableBox.propTypes = {
    headings: PropTypes.array.isRequired,
    search: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            selectableBox: PropTypes.shape({
                firstColumn: PropTypes.string.isRequired,
                secondColumn: PropTypes.string.isRequired,
            }),
        })
    ).isRequired,
    activeItemID: PropTypes.string,
    handleItemClick: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool,
};

export default DoubleSelectableBox;
