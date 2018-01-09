import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectableBoxItem from './SelectableBoxItem';

const propTypes = {
    numberOfColumns: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        heading: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired
    })).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        selectableBox: PropTypes.shape({
            firstColumn: PropTypes.shape({
                value: PropTypes.string.isRequired,
                width: PropTypes.string.isRequired
            }).isRequired,
            secondColumn: PropTypes.shape({
                value: PropTypes.string.isRequired,
                width: PropTypes.string.isRequired
            }),
            thirdColumn: PropTypes.shape({
                value: PropTypes.string.isRequired,
                width: PropTypes.string.isRequired
            })
        }),
    })).isRequired,
    activeItem: PropTypes.object,
    handleItemClick: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool,
}

export default class SelectableBox extends Component {
    constructor(props) {
        super(props);

        this.bindItemClick = this.bindItemClick.bind(this);
    }

    bindItemClick(itemProps) {
        this.props.handleItemClick(itemProps);
    }

    renderList() {
        return (
            <ul className="selectable-box__list">
                {
                    this.props.items.map(item => {
                        return (
                            <SelectableBoxItem
                                key={item.id}
                                {...item}
                                isSelected={this.props.activeItem && item.id === this.props.activeItem.id}
                                handleClick={this.bindItemClick}
                                numberOfColums={this.props.numberOfColumns}
                            />
                        )
                    })
                }
            </ul>
        )
    }

    renderHeadings() {
        return (
            <div className="grid">
                {
                    this.props.columns.map((column, index) => {
                        const isLastColumn = this.props.columns.length === index + 1;
                        return (
                            <h2 key={index} className={`selectable-box__heading grid__col-${column.width} grid__cell`}>
                                {column.heading}
                                { this.props.isUpdating && isLastColumn ? <span className="selectable-box__status pull-right loader"/> : "" }
                            </h2>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        return (
            <div className="selectable-box">
                { this.renderHeadings() }
                { this.renderList() }
            </div>
        )
    }
}

SelectableBox.propTypes = propTypes;