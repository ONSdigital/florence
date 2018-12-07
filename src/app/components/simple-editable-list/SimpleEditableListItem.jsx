import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const propTypes = {
    // title: PropTypes.string.isRequired,
    // id: PropTypes.string.isRequired,
    // url: PropTypes.string.isRequired,
    // details: PropTypes.arrayOf(PropTypes.string)
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
                <div className="grid__col-lg-3">
                    <p>{this.props.field.type}</p>
                </div>
                <div className="grid__col-lg-7">
                    <p>{this.props.field.description}</p>
                </div>
                <div className="grid__col-lg-2">
                    <p style={{"textAlign": "right"}}>
                        <span className="btn--link" onClick={this.handleEditClick}>Edit</span> | 
                        <span className="btn--link" onClick={this.handleDeleteClick}>Delete</span>
                    </p>  
                </div>

            </li>
        )
    }
}

SimpleEditableListItemItem.propTypes = propTypes;