import React, { Component } from "react";
import PropTypes from "prop-types";

import SelectableBoxItem from "./SelectableBoxItem";

const propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            heading: PropTypes.string.isRequired,
            width: PropTypes.string.isRequired,
        })
    ).isRequired,
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            columnValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element])),
            returnValue: PropTypes.object.isRequired,
        })
    ).isRequired,
    activeRowID: PropTypes.string,
    handleItemClick: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool.isRequired,
};

export default class SelectableBox extends Component {
    bindItemClick = clickedItem => {
        this.props.handleItemClick(clickedItem);
    };

    renderList() {
        return (
            <ul className="selectable-box__list">
                {this.props.rows &&
                    this.props.rows.map(row => {
                        return (
                            <SelectableBoxItem
                                columns={this.props.columns}
                                key={row.id}
                                {...row}
                                isSelected={this.props.activeRowID === row.id}
                                handleClick={this.bindItemClick}
                            />
                        );
                    })}
            </ul>
        );
    }

    renderHeadings() {
        return (
            <div className="grid">
                {this.props.columns.map((column, index) => {
                    const isLastColumn = this.props.columns.length === index + 1;
                    return (
                        <h2 key={`selectable-box__heading-${index}`} className={`selectable-box__heading grid__col-${column.width} grid__cell`}>
                            {column.heading}
                            {this.props.isUpdating && isLastColumn ? <span className="selectable-box__status pull-right loader" /> : ""}
                        </h2>
                    );
                })}
            </div>
        );
    }

    render() {
        return (
            <div className="selectable-box">
                {this.renderHeadings()}
                {this.renderList()}
            </div>
        );
    }
}

SelectableBox.propTypes = propTypes;
