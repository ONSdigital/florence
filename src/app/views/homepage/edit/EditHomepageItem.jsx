import React, { Component } from "react";
import PropTypes from "prop-types";

import Modal from "../../../components/Modal";
import Input from "../../../components/Input";

const propTypes = {
    params: PropTypes.shape({
        homepageDataField: PropTypes.string.isRequired
    }),
    data: PropTypes.shape({
        id: PropTypes.number,
        description: PropTypes.string,
        uri: PropTypes.string,
        title: PropTypes.string
    }),
    handleSuccessClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired
};

export default class EditHomepageItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.data ? this.props.data.id : null,
            description: this.props.data ? this.props.data.description : "",
            uri: this.props.data ? this.props.data.uri : "",
            title: this.props.data ? this.props.data.title : ""
        };
    }

    handleSuccessClick = () => {
        this.props.handleSuccessClick(this.state, this.props.params.homepageDataField);
    };

    handleInputChange = event => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.setState({ [fieldName]: value });
    };

    renderModalBody = () => {
        switch (this.props.params.homepageDataField) {
            case "featuredContent": {
                return (
                    <div>
                        <Input id="title" type="input" label="Title" value={this.state.title} onChange={this.handleInputChange} />
                        <Input id="uri" type="input" label="URL" value={this.state.uri} onChange={this.handleInputChange} />
                        <Input
                            id="description"
                            type="textarea"
                            label="Description"
                            value={this.state.description}
                            onChange={this.handleInputChange}
                        />
                    </div>
                );
            }
            default: {
                return <p>Something went wrong: unsupported field type</p>;
            }
        }
    };

    render() {
        return (
            <Modal>
                <div className="modal__header">
                    <h2>Add an item</h2>
                </div>
                <div className="modal__body">{this.renderModalBody()}</div>
                <div className="modal__footer">
                    <button id="continue" type="button" className="btn btn--primary btn--margin-right" onClick={this.handleSuccessClick}>
                        Continue
                    </button>
                    <button id="cancel" type="button" className="btn" onClick={this.props.handleCancelClick}>
                        Cancel
                    </button>
                </div>
            </Modal>
        );
    }
}

EditHomepageItem.propTypes = propTypes;
