import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectableBoxItem from './SelectableBoxItem';

const propTypes = {
    headings: PropTypes.array.isRequired,
    items: PropTypes.array,
    activeItem: PropTypes.object,
    handleItemClick: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool,
    numberOfColumns: PropTypes.number.isRequired
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
                    this.props.items.map((item, index) => {
                        return (
                            <SelectableBoxItem
                                key={index}
                                {...item}
                                isSelected={this.props.activeItem && item.id === this.props.activeItem.id}
                                handleClick={this.bindItemClick}
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
                    this.props.headings.map((item, index) => {
                        return (
                            <h2 key={index} className="selectable-box__heading grid__col-12">
                                {item}
                                { this.props.isUpdating && this.props.headings.length === index + 1 ? <span className="selectable-box__status loader"/> : "" }
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