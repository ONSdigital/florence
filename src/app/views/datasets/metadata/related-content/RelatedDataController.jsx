import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RelatedContentForm from "./RelatedContentForm";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired
};

export class RelatedDataController extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <RelatedContentForm name="related-content-form" />;
    }
}

RelatedContentForm.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        name: state.state.teams.active.name,
        rootPath: state.state.rootPath,
        pathname: state.routing.locationBeforeTransitions.pathname
    };
}

export default connect(mapStateToProps)(RelatedContentForm);
