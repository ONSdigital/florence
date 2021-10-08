import React, { Component } from "react";
import PropTypes from "prop-types";

import DoubleSelectableBoxItem from "./DoubleSelectableBoxItem";

const propTypes = {
    headings: PropTypes.array.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            selectableBox: PropTypes.shape({
                firstColumn: PropTypes.string.isRequired,
                secondColumn: PropTypes.string.isRequired
            })
        })
    ).isRequired,
    activeItemID: PropTypes.string,
    handleItemClick: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool
};

export default class DoubleSelectableBoxController extends Component {
    bindItemClick = itemProps => {
        this.props.handleItemClick(itemProps);
    };

    renderList() {
        return (
            <ul id="selectable-box" className="selectable-box__list">
                {this.props.items.map((item, index) => {
                    return (
                        <DoubleSelectableBoxItem
                            key={index}
                            {...item}
                            isSelected={this.props.activeItemID && item.id === this.props.activeItemID}
                            handleClick={this.bindItemClick}
                        />
                    );
                })}
            </ul>
        );
    }

    render() {
        return (
            <div className="selectable-box">
                <div className="grid">
                    <h2 className="selectable-box__heading grid__col-6">{this.props.headings[0]}</h2>
                    <h2 className="selectable-box__heading grid__col-6 grid__cell">
                        {this.props.headings[1]}
                        {this.props.isUpdating && <span className="selectable-box__status pull-right loader" />}
                    </h2>
                </div>
                {this.renderList()}
            </div>
        );
    }
}

DoubleSelectableBoxController.propTypes = propTypes;
