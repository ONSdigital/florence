import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../components/Modal';
import Input from '../../../components/Input';

const propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    instanceID: PropTypes.string.isRequired
}

export default class DatasetChangesAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title || "",
            description: this.props.description || ""
        }

        this.updateTitle = this.updateTitle.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const updatedAlert = {
            title: this.state.title,
            description: this.state.description
        }
        this.props.onSave(updatedAlert, this.props.id);
    }

    updateTitle(event) {
        event.preventDefault();
        this.setState({title: event.target.value});
    }

    updateDescription(event) {
        event.preventDefault();
        this.setState({description: event.target.value});
    }

    render() {
        return (
            <Modal sizeClass="grid__col-4">
                <form onSubmit={this.handleFormSubmit}>
                    <h2 className="modal__header">
                        {this.props.id ? "Edit alert" : "Add alert"}
                    </h2>
                    <div className="modal__body">
                        <Input 
                            label="Title"
                            id="alert-title"
                            value={this.state.title || ""}
                            type="text"
                            onChange={this.updateTitle}
                        />
                        <Input
                            label="Description"
                            id="alert-description"
                            value={this.state.description || ""}
                            type="textarea"
                            onChange={this.updateDescription}
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

DatasetChangesAlert.propTypes = propTypes;