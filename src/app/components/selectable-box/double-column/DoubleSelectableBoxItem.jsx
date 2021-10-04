import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    id: PropTypes.any.isRequired,
    selectableBox: PropTypes.shape({
        firstColumn: PropTypes.string.isRequired,
        secondColumn: PropTypes.string.isRequired
    }),
    status: PropTypes.shape({
        neutral: PropTypes.bool.isRequired,
        warning: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired
    }),
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool
};

export default class DoubleSelectableBoxItem extends Component {
    bindClick = () => {
        this.props.handleClick(this.props);
    };

    render() {
        return (
            <li
                id={this.props.id}
                className={`selectable-box__item ${this.props.isSelected ? " selected" : ""} ${this.props.status.neutral ? " neutral" : ""} ${
                    this.props.status.warning ? " warning" : ""
                }`}
                onClick={this.bindClick}
            >
                <div className="grid">
                    <div className="grid__col-6">
                        {this.props.selectableBox.firstColumn}
                        {this.props.status.message ? ` [${this.props.status.message}]` : ""}
                    </div>
                    <div className="grid__col-6">{this.props.selectableBox.secondColumn}</div>
                </div>
            </li>
        );
    }
}

DoubleSelectableBoxItem.propTypes = propTypes;
