import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../components/Modal';
import Input from '../../../components/Input';

const propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    instanceID: PropTypes.string.isRequired
}

export default class DatasetChangesModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: {
                value: this.props.title || "",
                error: ""
            },
            description: {
                value: this.props.description || "",
                error: ""
            }
        }

        this.updateTitle = this.updateTitle.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(event) {
        event.preventDefault();

        if (!this.state.title.value) {
            this.setState({
                title: {
                    value: this.state.title.value,
                    error: "Title must not be empty"
                }
            })
        }
        if (!this.state.description.value) {
            this.setState({
                description: {
                    value: this.state.description.value,
                    error: "Description must not be empty"
                }
            })
        }
        if (!this.state.description.value || !this.state.title.value) {
            return;
        }


        const updatedObject = {
            title: this.state.title.value,
            description: this.state.description.value
        };
        this.props.onSave(updatedObject, this.props.id);
    }

    updateTitle(event) {
        event.preventDefault();
        this.setState({
            title: {
                value: event.target.value,
                error: ""
            }
        });
    }

    updateDescription(event) {
        event.preventDefault();
        this.setState({
            description: {
                value: event.target.value,
                error: ""
            }
        });
    }

    render() {
        return (
            <Modal sizeClass="grid__col-4">
                <form onSubmit={this.handleFormSubmit}>
                    <h2 className="modal__header">
                        {this.props.id ? `Edit ${this.props.type}` : `Add ${this.props.type}`}
                    </h2>
                    <div className="modal__body">
                        <Input 
                            label="Title"
                            id="change-modal-title"
                            value={this.state.title.value || ""}
                            type="text"
                            onChange={this.updateTitle}
                            error={this.state.title.error}
                        />
                        <Input
                            label="Description"
                            id="change-modal-description"
                            value={this.state.description.value || ""}
                            type="textarea"
                            onChange={this.updateDescription}
                            error={this.state.description.error}
                        />
                    </div>
                    <div className="modal__footer">
                        <button type="submit" className="btn btn--positive">
                            {this.props.id ? "Edit" : "Add"}
                        </button>
                        <a href="" className="margin-left--1" onClick={this.props.onCancel}>Cancel</a>
                    </div>
                </form>
            </Modal>
        )
    }
}

DatasetChangesModal.propTypes = propTypes;