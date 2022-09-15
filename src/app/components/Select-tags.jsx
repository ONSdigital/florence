import React, { Component } from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
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
    handleChange: PropTypes.func,
    multipleSelection: PropTypes.bool,
    error: PropTypes.string,
};


const customStyles = {
    option: (styles, state) => ({
        ...styles,
        color: "black",
        backgroundColor: state.isDisabled ? undefined : state.isSelected ? "#ddd" : state.isFocused ? "#ddd" : "white",
        ":active": {
            ...styles[":active"],
            backgroundColor: !state.isDisabled ? (state.isSelected ? "#ddd" : "#ddd") : undefined,
        },
        padding: 20,
    }),
    container: (styles, state) => ({
        ...styles,
        border: "3px solid #58585B",
        borderRadius: "4px",
        boxShadow: state.isFocused ? "0 0 0 3px #ffbf47" : "none",
        backgroundColor: "#FFFFFF",
        outlineStyle: "none",
    }),
    control: styles => ({
        ...styles,
        border: "none",
        backgroundColor: "transparent",
        outlineStyle: "none",
    }),
    menuList: styles => ({
        ...styles,
        marginBottom: "35px",
    }),
    multiValueRemove: styles => ({
        ...styles,
        ":hover": {
            backgroundColor: "#ddd",
            color: "#333333",
        },
    }),
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
                    hideSelectedOptions={false}
                    styles={customStyles}
                />
            </div>
        );
    }
}
SelectTags.propTypes = propTypes;
export default SelectTags;
