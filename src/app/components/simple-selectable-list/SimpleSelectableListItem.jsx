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
                    <p className="simple-select-list__title simple-select-list__title--disabled">{this.props.title}</p>
                ) : (
                    <Link to={this.props.url}>
                        <p className="simple-select-list__title">{this.props.title}</p>
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
