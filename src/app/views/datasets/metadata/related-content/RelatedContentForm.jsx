import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from '../../../../components/Input';

const propTypes = {
    titleInput: PropTypes.string,
    urlInput: PropTypes.string,
    name: PropTypes.string.isRequired,
    isPosting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onFormInput: PropTypes.func.isRequired,
    titleError:PropTypes.string,
    urlError:PropTypes.string
}

class RelatedContentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            titleInput: "",
            urlInput: ""
        }
    }

    componentWillMount() {
        if (this.props.urlInput || this.props.titleInput) {
            this.setState({
                titleInput: this.props.titleInput,
                urlInput: this.props.urlInput
            });
        }
    }

    render() {
        return (
            <form className="form" onSubmit={this.props.onFormSubmit}>
                <div className="modal__header">
                    <h2> Add related content: </h2>
                </div>
                <div className="modal__body">
                      <Input
                            type="text"
                            label="Page title"
                            id="add-related-content-title"
                            name="add-related-content-title"
                            error={this.props.titleError}
                            onChange={this.props.onFormInput}
                            onCancel={this.props.onCancel}
                            isFocused={true}
                            value={this.props.titleInput}
                        />
                        <Input
                            type="text"
                            label="Page URL"
                            error={this.props.urlError}
                            id="add-related-content-url"
                            name="add-related-content-url"
                            value={this.props.urlInput}
                            onChange={this.props.onFormInput}
                            onCancel={this.props.onCancel}
                        />
                    </div>
                    <div className="modal__footer">
                    <button disabled={this.props.isPosting} className={"btn btn--primary btn--margin-right"}>Add</button>
                    <button type="button" disabled={this.props.isPosting} className="btn" onClick={this.props.onCancel}>Cancel</button>
                    {this.props.isPosting &&
                        <div className="loader"></div>
                    }
                </div>
            </form>
        )
    }
}

RelatedContentForm.propTypes = propTypes;

export default RelatedContentForm;
