import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

const propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool
};

export default class SimpleSelectableListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const details = this.props.details || [];
        return (
            <li className="simple-select-list__item">
                {this.props.disabled ? (
                    <h2 className="simple-select-list__item--disabled">{this.props.title}</h2>
                ) : (
                    <Link to={this.props.url}>
                        <h2>{this.props.title}</h2>
                    </Link>
                )}
                {details.map((detail, i) => {
                    return <p key={`detail-${i}`}>{detail}</p>;
                })}
            </li>
        );
    }
}

SimpleSelectableListItem.propTypes = propTypes;
