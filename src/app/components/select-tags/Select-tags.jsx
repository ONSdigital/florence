import React, { Component } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { customStyles } from "./selectTagsCustomStyle";

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    contents: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                })
            ),
        })
    ).isRequired,
    handleChange: PropTypes.func.isRequired,
    multipleSelection: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    singleDefaultValue: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }),
    multiDefaultValue: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
};

class SelectTags extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"form__input" + (this.props.error ? " form__input--error" : "")}>
                <label className="form__label" htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                {this.props.error && (
                    <div className="error-msg" role="alert">
                        {this.props.error}
                    </div>
                )}
                <Select
                    maxMenuHeight={250}
                    onChange={this.props.handleChange}
                    options={this.props.contents}
                    isMulti={this.props.multipleSelection}
                    value={this.props.multipleSelection ? this.props.multiDefaultValue : this.props.singleDefaultValue}
                    styles={customStyles(this.props.error)}
                    isDisabled={this.props.disabled}
                    isClearable
                />
            </div>
        );
    }
}
SelectTags.propTypes = propTypes;
export default SelectTags;
