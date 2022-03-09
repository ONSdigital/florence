import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "../../../components/Input";

const propTypes = {
    input: PropTypes.shape({
        value: PropTypes.string,
        error: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
    isPosting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onFormInput: PropTypes.func.isRequired,
};

class InteractiveDeleteForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form className="form" onSubmit={this.props.onFormSubmit}>
                <div className="modal__header">
                    <h2>Delete team: {this.props.name}</h2>
                </div>
                <div className="modal__body">
                    <div className="form__input">
                        <Input
                            type="text"
                            label="Confirm the name of the team you'd like to delete"
                            id="team-name"
                            error={this.props.input.error}
                            onChange={this.props.onFormInput}
                            isFocused={true}
                        />
                    </div>
                </div>
                <div className="modal__footer">
                    <button disabled={this.props.isPosting} className={"btn btn--warning btn--margin-right"}>
                        Delete
                    </button>
                    <button type="button" disabled={this.props.isPosting} className="btn" onClick={this.props.onCancel}>
                        Cancel
                    </button>
                    {this.props.isPosting && <div className="loader"></div>}
                </div>
            </form>
        );
    }
}

InteractiveDeleteForm.propTypes = propTypes;

export default InteractiveDeleteForm;
