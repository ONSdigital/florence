import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.any.isRequired,
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool
}

export default class SelectableBoxItem extends Component {
    constructor(props) {
        super(props);

        this.bindClick = this.bindClick.bind(this);
    }

    bindClick() {
        this.props.handleClick(this.props);
    }

    render() {
        return (
            <li
                id={this.props.id}
                className={`selectable-box__item ${this.props.isSelected ? " selected" : ""} ${this.props.status.neutral ? " neutral" : ""} ${this.props.status.warning ? " warning" : ""}`}
                onClick={this.bindClick}>
                <div className="grid">
                    <div className={`grid__col-${this.props.selectableBox.firstColumn.width}`}>
                        {this.props.selectableBox.firstColumn.value}
                        {this.props.status.message ? ` [${this.props.status.message}]` : ''}
                    </div>

                    {this.props.selectableBox.secondColumn ?
                        <div className={`grid__col-${this.props.selectableBox.secondColumn.width}`}>
                            {this.props.selectableBox.secondColumn.value}
                        </div>
                        : ''}

                    {this.props.selectableBox.thirdColumn ?
                        <div className={`grid__col-${this.props.selectableBox.thirdColumn.width}`}>
                            {this.props.selectableBox.thirdColumn.value}
                        </div>
                        : ''}
                </div>
            </li>
        )
    }
}

SelectableBoxItem.propTypes = propTypes;