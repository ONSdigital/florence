import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    field: PropTypes.shape({
        simpleListHeading: PropTypes.string.isRequired,
        simpleListDescription: PropTypes.string
    }),
    handleEditClick: PropTypes.func.isRequired,
    handleDeleteClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
}

export default class SimpleEditableListItemItem extends Component {
    constructor(props) {
        super(props);
    }

    handleEditClick = () => {
        this.props.handleEditClick(this.props.field)
    }

    handleDeleteClick = () => {
        this.props.handleDeleteClick(this.props.field)
    }

    render() {
        return (
            <li className="simple-select-list__item grid">
                <div className="grid__col-lg-10">
                    <p className="font-weight--600">{this.props.field.simpleListHeading}</p>
                    <p>{this.props.field.simpleListDescription}</p>
                </div>
                <div className="grid__col-lg-2">
                    <p className="text-right">
                        <button type="button" className="btn btn--link" onClick={this.handleEditClick} disabled={this.props.disabled}>Edit</button> | 
                        <button type="button" className="btn btn--link" onClick={this.handleDeleteClick} disabled={this.props.disabled}>Delete</button>
                    </p>  
                </div>

            </li>
        )
    }
}

SimpleEditableListItemItem.propTypes = propTypes;