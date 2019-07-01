import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    email: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    action: PropTypes.oneOf(["add", "remove"]).isRequired
};

class TeamEditItem extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick({
            email: this.props.email,
            action: this.props.action
        });
    }

    render() {
        return (
            <li className={"add-remove__item"}>
                <span className={`add-remove__item-title ${this.props.isDisabled ? "disabled" : ""}`}>{this.props.email}</span>
                <button
                    onClick={this.handleClick}
                    className={`btn ${this.props.action === "add" ? "btn--positive" : ""}`}
                    disabled={this.props.isDisabled}
                    data-email={this.props.email}
                    data-action={this.props.action}
                >
                    {this.props.action === "add" ? "Add" : "Remove"}
                </button>
            </li>
        );
    }
}

TeamEditItem.propTypes = propTypes;

export default TeamEditItem;
