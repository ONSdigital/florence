import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

const propTypes = {
}

class DatasetRelated extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <h1></h1>
                    <div className="margin-bottom--1">
                            &#9664; <Link to={``}>Back</Link>
                    </div>
                    <h2 className="margin-bottom--1">Related content</h2>
                    <div className="margin-bottom--1">
                        <p> These are common across all editions of the dataset. Changing them will affect all previous editions.</p>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Bulletins, articles and compendia </h3>
                        <a href="#"> Add document </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> QMIs </h3>
                        <a href="#"> Add QMI </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Methodology </h3>
                        <a href="#"> Add methodology </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Other related topics </h3>
                        <a href="#"> Add related topic </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Related links </h3>
                        <a href="#"> Add related link </a>
                    </div>
                    <div className="grid__col-4">
                        <button className="btn btn--positive" type="submit">Save and Continue</button>
                    </div>
                </div>
            </div>
        )
    }
}

DatasetRelated.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetRelated);