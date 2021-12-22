import React, { Component } from "react";
import PropTypes from "prop-types";

import SimpleEditableListItem from "./SimpleEditableListItem";

const propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            simpleListHeading: PropTypes.string,
            simpleListDescription: PropTypes.string,
        })
    ),
    editingStateFieldName: PropTypes.string,
    addText: PropTypes.string,
    showLoadingState: PropTypes.bool,
    handleAddClick: PropTypes.func.isRequired,
    handleEditClick: PropTypes.func.isRequired,
    handleDeleteClick: PropTypes.func.isRequired,
    disableActions: PropTypes.bool,
    maximumNumberOfEntries: PropTypes.number,
};

export default class SimpleEditableList extends Component {
    constructor(props) {
        super(props);
    }

    handleAddClick = () => {
        this.props.handleAddClick(this.props.editingStateFieldName);
    };

    handleEditClick = editedField => {
        this.props.handleEditClick(editedField, this.props.editingStateFieldName);
    };

    handleDeleteClick = deletedField => {
        this.props.handleDeleteClick(deletedField, this.props.editingStateFieldName);
    };

    hasReachedMaximumNumberOfEntries = () => {
        if (this.props.maximumNumberOfEntries == null || this.props.fields == null) {
            return false;
        }

        if (this.props.fields.length >= this.props.maximumNumberOfEntries) {
            return true;
        }
    };

    render() {
        return (
            <div>
                {this.props.fields?.length ? (
                    <ul className="list list--neutral simple-select-list">
                        {this.props.fields.map((field, index) => {
                            return (
                                <pSimpleEditableListItem
                                    key={`${this.editingStateFieldName}-${index}`}
                                    field={field}
                                    handleEditClick={this.handleEditClick}
                                    handleDeleteClick={this.handleDeleteClick}
                                    disabled={this.props.disableActions}
                                />
                            );
                        })}
                    </ul>
                ) : null}
                <button
                    type="button"
                    className={"btn btn--link " + (this.props.fields?.length ? "margin-top--1" : "")}
                    onClick={this.handleAddClick}
                    disabled={this.props.disableActions || this.hasReachedMaximumNumberOfEntries()}
                >
                    {this.props.addText ? this.props.addText : "Add a new item"}
                </button>
            </div>
        );
    }
}

SimpleEditableList.propTypes = propTypes;
