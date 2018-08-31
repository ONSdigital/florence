import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    isVisible: PropTypes.bool,
    isAnimatable: PropTypes.bool,
    handleTransitionEnd: PropTypes.func,
    children: PropTypes.node
}

const defaultProps = {
    handleTransitionEnd: () => {}
}

class Drawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // This classes is added because it's useful for testing to have something in the DOM
            // that signifies when the animation is finished. It means we don't have to inputs timeouts
            // or rely on the tests running slow enough to be able to select the elements inside the drawer
            hasFinishedAnimation: false
        };

        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    }

    handleTransitionEnd() {
        this.props.handleTransitionEnd();
        this.setState({hasFinishedAnimation: true});
    }

    addAnimationClasses() {
        const classes = [];

        if (this.props.isAnimatable) {
            classes.push('animatable');
        }
        
        if (this.props.isVisible) {
            classes.push('visible');
        }

        if (this.state.hasFinishedAnimation) {
            classes.push('animation-finished');
        }

        return classes.join(' ');
    }

    render() {
        return (
            <div className={`drawer ${this.addAnimationClasses()}`} onTransitionEnd={this.handleTransitionEnd}>
                {this.props.children}
            </div>
        )
    }
}

Drawer.propTypes = propTypes;
Drawer.defaultProps = defaultProps;

export default Drawer;