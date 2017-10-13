import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import url from '../../../utilities/url'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        instanceID: PropTypes.string,
        edition: PropTypes.string,
        version: PropTypes.string
    }).isRequired
}

class VersionMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVersion: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (this.props.params.instanceID) {
            this.setState({isVersion: false});
            return;
        }

        this.setState({isVersion : true});
    }

    shouldComponentUpdate(_, nextState) {
        // No need to re-render, this state does not impact the view. 
        // Just used to confirm whether we're on a version or instance
        if (nextState.isVersion) {
            return false;
        }

        return true;
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.isVersion) {
            this.props.dispatch(push(url.resolve("collection")));
            return;
        }

        console.log('Not yet a version, will need to do post -> confirm edition and version -> redirect to the collection endpoint on that route');
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <h1>Placeholder for version details</h1>
                    <p>This is the page for <a href="https://projects.invisionapp.com/share/CQCR545XV#/screens/255270448">instance details</a>, such as:</p>
                    <ul className="margin-top--1 margin-left--1">
                        <li>Edition confirmation</li>
                        <li>Changes in this version</li>
                        <li>Contact details</li>
                        <li>etc...</li>
                    </ul>
                    <form onSubmit={this.handleSubmit}>
                        <button className="btn btn--primary">Save and continue</button>
                    </form>
                </div>
            </div>
        )
    }
}

VersionMetadata.propTypes = propTypes;

export default connect()(VersionMetadata);