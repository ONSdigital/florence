import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.any.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        heading: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired
    })).isRequired,
    columnValues: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ])),
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    returnValue: PropTypes.object.isRequired,
    status: PropTypes.shape({
        neutral: PropTypes.bool.isRequired,
        warning: PropTypes.bool.isRequired,
        success: PropTypes.bool.isRequired,
        message: PropTypes.string,
    }).isRequired,
}

export default class SelectableBoxItem extends Component {
    constructor(props) {
        super(props);

        this.bindClick = this.bindClick.bind(this);
    }

    bindClick() {
        this.props.handleClick(this.props.returnValue);
    }

    renderColumns() {
        const columns = [];
        for (let i = 0; i < this.props.columns.length; i++) {
            const isFirst = i === 0;
            columns.push(
                <div key={`${this.props.id}-col-${i}`} className={`grid__col-${this.props.columns[i].width}`}>
                    {this.props.columnValues[i]}

                    {this.props.status.message && isFirst ? ` [${this.props.status.message}]` : ''}
                </div>
            )
        }
        return columns
    }

    render() {
        return (
            <li
                id={this.props.id}
                className={`selectable-box__item ${this.props.isSelected ? " selected" : ""} ${this.props.status.neutral ? " neutral" : ""} ${this.props.status.warning ? " warning" : ""}`}
                onClick={this.bindClick}>
                <div className="grid">
                    {this.renderColumns()}
                </div>
            </li>
        )
    }
}

SelectableBoxItem.propTypes = propTypes;