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
};

class SelectTags extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Select maxMenuHeight={250} onChange={this.props.handleChange} options={this.props.contents} isMulti={this.props.multipleSelection} />;
    }
}

SelectTags.propTypes = propTypes;
export default SelectTags;
