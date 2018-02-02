import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Input from '../../../../components/Input';

const propTypes = {
    nameInput: PropTypes.string,
    descriptionInput: PropTypes.string,
    isPosting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onFormInput: PropTypes.func.isRequired,
    nameError: PropTypes.string,
    descriptionError: PropTypes.string
}

class ChangesForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nameInput: "",
            descriptionInput: ""
        }
    }

    componentWillMount() {
        if (this.props.nameInput || this.props.descriptionInput) {
            this.setState({
                nameInput: this.props.nameInput,
                descriptionInput: this.props.descriptionInput
            });
        }
    }

    render() {
        return (
            <form className="form" onSubmit={this.props.onFormSubmit}>
                <div className="modal__header">
                    <h2> Add latest change: </h2>
                </div>
                <div className="modal__body">
                      <Input
                            type="text"
                            label="Name"
                            id="add-change-name"
                            name="add-change-name"
                            error={this.props.nameError}
                            onChange={this.props.onFormInput}
                            onCancel={this.props.onCancel}
                            isFocused={true}
                            value={this.props.nameInput}
                        />
                        <Input
                            type="text"
                            label="Change Description"
                            error={this.props.descriptionError}
                            id="add-change-description"
                            name="add-change-description"
                            value={this.props.descriptionInput}
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

ChangesForm.propTypes = propTypes;

export default ChangesForm;