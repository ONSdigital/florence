import React, { Component } from "react";
import PropTypes from "prop-types";

import SelectableBoxItem from "./SelectableBoxItem";

const propTypes = {
    heading: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    activeItem: PropTypes.object,
    handleItemClick: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool,
};

export default class SelectableBoxController extends Component {
    bindItemClick = itemProps => {
        this.props.handleItemClick(itemProps);
    };

    renderList() {
        return (
            <ul className="selectable-box__list">
                {this.props.items.map((item, index) => {
                    return (
                        <SelectableBoxItem
                            key={index}
                            {...item}
                            isSelected={this.props.activeItem && item.id === this.props.activeItem.id}
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
                <h2 className="selectable-box__heading">
                    {this.props.heading}
                    {this.props.isUpdating && <span className="selectable-box__status loader" />}
                </h2>
                {this.props.items.length > 0 ? (
                    this.renderList()
                ) : (
                    <p className="margin-top--1 margin-right--1 margin-bottom--1 margin-left--1">No items to display</p>
                )}
            </div>
        );
    }
}

SelectableBoxController.propTypes = propTypes;
