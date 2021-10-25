import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";

const propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    title: PropTypes.string,
    note: PropTypes.string,
    id: PropTypes.string.isRequired,
};

export class UsageNotesController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.title,
            note: props.note,
            id: props.id || uuid(),
        };
    }

    handleChange = (property, event) => {
        this.setState({
            [property]: event.target.value,
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        this.props.onSave({
            id: this.state.id,
            title: this.state.title,
            note: this.state.note,
        });
    };

    render() {
        return (
            <Modal sizeClass="grid__col-lg-5 grid__col-md-8 grid__col-xs-10">
                <form onSubmit={this.handleSubmit}>
                    <div className="modal__header">
                        <h2>Usage note:</h2>
                    </div>
                    <div className="modal__body">
                        <Input id="usage-note-title" label="Title" value={this.state.title} onChange={event => this.handleChange("title", event)} />
                        <Input
                            id="usage-note-description"
                            label="Note"
                            value={this.state.note}
                            onChange={event => this.handleChange("note", event)}
                            type="textarea"
                        />
                    </div>
                    <div className="modal__footer">
                        <button className="btn btn--primary" type="submit">
                            Save
                        </button>
                        <button className="btn margin-left--1" type="button" onClick={this.props.onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        );
    }
}

UsageNotesController.propTypes = propTypes;

export default UsageNotesController;
