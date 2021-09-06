import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "../../../../components/Input";

const propTypes = {
    formTitle: PropTypes.string,
    titleLabel: PropTypes.string,
    titleInput: PropTypes.string,
    urlLabel: PropTypes.string,
    urlInput: PropTypes.string,
    descLabel: PropTypes.string,
    descInput: PropTypes.string,
    name: PropTypes.string.isRequired,
    isPosting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onFormInput: PropTypes.func.isRequired,
    titleError: PropTypes.string,
    urlError: PropTypes.string,
    descError: PropTypes.string,
    requiresDescription: PropTypes.bool,
    requiresURL: PropTypes.bool
};

class RelatedContentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formTitle: "",
            titleLabel: "",
            titleInput: "",
            urlLabel: "",
            urlInput: "",
            descLabel: "",
            descInput: ""
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.urlInput || this.props.titleInput || this.props.descInput) {
            this.setState({
                titleInput: this.props.titleInput,
                urlInput: this.props.urlInput,
                descInput: this.props.descInput,
                titleLabel: this.props.titleLabel,
                urlLabel: this.props.urlLabel,
                descLabel: this.props.descLabel,
                formTitle: this.props.formTitle
            });
        }
    }

    render() {
        return (
            <form className="form" onSubmit={this.props.onFormSubmit}>
                <div className="modal__header">
                    <h2>{this.props.formTitle}:</h2>
                </div>
                <div className="modal__body">
                    <Input
                        type="text"
                        label={this.props.titleLabel}
                        id="add-related-content-title"
                        name="add-related-content-title"
                        error={this.props.titleError}
                        onChange={this.props.onFormInput}
                        onCancel={this.props.onCancel}
                        isFocused={true}
                        value={this.props.titleInput}
                    />
                    {this.props.requiresURL && (
                        <Input
                            type="text"
                            label={this.props.urlLabel}
                            error={this.props.urlError}
                            id="add-related-content-url"
                            name="add-related-content-url"
                            value={this.props.urlInput}
                            onChange={this.props.onFormInput}
                            onCancel={this.props.onCancel}
                        />
                    )}
                    {this.props.requiresDescription && (
                        <Input
                            type="textarea"
                            label={this.props.descLabel}
                            error={this.props.descError}
                            id="add-related-content-desc"
                            name="add-related-content-desc"
                            value={this.props.descInput}
                            onChange={this.props.onFormInput}
                            onCancel={this.props.onCancel}
                        />
                    )}
                </div>
                <div className="modal__footer">
                    <button disabled={this.props.isPosting} className={"btn btn--primary btn--margin-right"}>
                        Add
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

RelatedContentForm.propTypes = propTypes;

export default RelatedContentForm;
