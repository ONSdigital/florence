import React from "react";
import PropTypes from "prop-types";
import Item from "./Item";

const DoubleSelectableBox = ({ items, activeItemID, handleItemClick, headings, isLoading }) => {
    if (!items) return null;

    const renderList = () => (
        <ul id="selectable-box" className="selectable-box__list">
            {items.map(item => {
                return (
                    <Item
                        key={item.id}
                        id={item.id}
                        selectableBox={item.selectableBox}
                        status={item.status}
                        isSelected={activeItemID && item.id === activeItemID}
                        handleClick={handleItemClick}
                    />
                );
            })}
        </ul>
    );

    return (
        <div className="selectable-box">
            <div className="grid">
                <h2 className="selectable-box__heading grid__col-6">{headings[0]}</h2>
                <h2 className="selectable-box__heading grid__col-6 grid__cell">
                    {headings[1]}
                    {isLoading && <span className="selectable-box__status pull-right loader" />}
                </h2>
            </div>
            {renderList()}
        </div>
    );
};

DoubleSelectableBox.propTypes = {
    headings: PropTypes.array.isRequired,
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
    isLoading: PropTypes.bool,
};

export default DoubleSelectableBox;
