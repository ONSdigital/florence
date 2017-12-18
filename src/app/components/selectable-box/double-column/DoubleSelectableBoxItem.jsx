import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.any.isRequired,
    firstColumn: PropTypes.string.isRequired,
    secondColumn: PropTypes.string.isRequired,
    selectableItem: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool
};

export default class DoubleSelectableBoxItem extends Component {
    constructor(props) {
        super(props);

        this.bindClick = this.bindClick.bind(this);
    }

    bindClick() {
        this.props.handleClick(this.props.selectableItem);
    }

    render() {
        return (
            <li
                id={this.props.id}
                className={`selectable-box__item ${this.props.isSelected ? " selected" : ""}`}
                onClick={this.bindClick}>
                <div className="grid">
                    <div className="grid__col-6">{this.props.firstColumn}</div>
                    <div className="grid__col-6">{this.props.secondColumn}</div>
                </div>
            </li>
        )
    }
}

DoubleSelectableBoxItem.propTypes = propTypes;