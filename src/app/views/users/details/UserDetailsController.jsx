import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';

import Drawer from '../../../components/drawer/Drawer';
import url from "../../../utilities/url";

const propTypes = {};

export class UserDetailsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mountTransition: true,
            isVisible: false
        };
    }

    handleTransitionEntered = () => {
        this.setState({isVisible: true});
    }
    
    handleTransitionExit = () => {
        this.setState({
            isVisible: false,
            isAnimatable: true
        });
    }

    handleTransitionExited = () => {
        this.props.dispatch(push(url.resolve("../")));
    }

    handleClose = () => {
        this.setState({mountTransition: false});
    }

    render () {
        return (
            <Transition 
                in={this.state.mountTransition} 
                appear={true} 
                timeout={{enter: 0, exit: 130}}
                onEntered={this.handleTransitionEntered} 
                onExit={this.handleTransitionExit} 
                onExited={this.handleTransitionExited}
            >
                <Drawer isVisible={this.state.isVisible} isAnimatable={true}>
                    <div className="drawer__container">
                        <div className="drawer__heading">
                            <h2>User: {this.props.params.userID}</h2>
                        </div>
                        <div className="drawer__body">
                            <p>Body text</p>
                        </div>
                        <div className="drawer__footer">
                            <button onClick={this.handleClose}>Close</button>
                        </div>
                    </div>
                </Drawer>
            </Transition>
        )
    }
}

UserDetailsController.propTypes = propTypes;

export default connect()(UserDetailsController);