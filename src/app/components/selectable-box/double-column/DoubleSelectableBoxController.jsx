import React from "react";
import PropTypes from "prop-types";
import DoubleSelectableBoxItem from "./DoubleSelectableBoxItem";

const propTypes = {
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

const DoubleSelectableBoxController = props => {
    const renderList = () => {
        return (
            <ul id="selectable-box" className="selectable-box__list">
                {props.items.map((item, index) => {
                    return (
                        <DoubleSelectableBoxItem
                            key={index}
                            {...item}
                            isSelected={props.activeItemID && item.id === props.activeItemID}
                            handleClick={() => props.handleItemClick(item.id)}
                        />
                    );
                })}
            </ul>
        );
    };
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
                <h2 className="selectable-box__heading grid__col-6">{props.headings[0]}</h2>
                <h2 className="selectable-box__heading grid__col-6 grid__cell">
                    {props.headings[1]}
                    {props.isUpdating && <span className="selectable-box__status pull-right loader" />}
                </h2>
            </div>
            {props.items.length > 0 ? renderList() : renderMessage()}
        </div>
    );
};

DoubleSelectableBoxController.propTypes = propTypes;

export default DoubleSelectableBoxController;
