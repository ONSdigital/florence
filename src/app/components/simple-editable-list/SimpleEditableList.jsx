import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SimpleEditableListItem from './SimpleEditableListItem';


const propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    })).isRequired,
    editingStateFieldName: PropTypes.string.isRequired,
    addText: PropTypes.string,
    showLoadingState: PropTypes.bool,
    handleAddClick: PropTypes.func.isRequired,
    handleEditClick: PropTypes.func.isRequired,
    handleDeleteClick: PropTypes.func.isRequired
}

export default class SimpleEditableList extends Component {
    constructor(props) {
        super(props);
    }

    handleAddClick = () => {
        this.props.handleAddClick(this.props.editingStateFieldName)
    }

    handleEditClick = (editedField) => {
        this.props.handleEditClick(editedField, this.props.editingStateFieldName);
    }

    handleDeleteClick = (deletedField) => {
        this.props.handleDeleteClick(deletedField, this.props.editingStateFieldName);
    }

    render() {
        return (
            <div>
            <ul className="list list--neutral simple-select-list">
                { 
                    this.props.fields.map((field, index) => {
                        return (
                            <SimpleEditableListItem key={`${this.editingStateFieldName}-${index}`} 
                                field={field} 
                                handleEditClick={this.handleEditClick}
                                handleDeleteClick={this.handleDeleteClick}
                            />
                        )
                    })   
                }
            </ul>
            <button type="button" className="btn btn--link margin-top--1" onClick={this.handleAddClick}>{this.props.addText ? this.props.addText : "Add a new item"}</button>
            </div>
        )
    }
}

SimpleEditableList.propTypes = propTypes;