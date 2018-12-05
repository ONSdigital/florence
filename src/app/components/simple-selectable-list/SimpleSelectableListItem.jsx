import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string)
}

export default class SimpleSelectableListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const details = this.props.details || [];
        return (
            <li className="simple-select-list__item">
                <Link to={this.props.url}><h2>{this.props.title}</h2></Link>
                {details.map((detail, i) => {
                    return <p key={`detail-${i}`}>{detail}</p>
                })}
            </li>
        )
    }
}

SimpleSelectableListItem.propTypes = propTypes;