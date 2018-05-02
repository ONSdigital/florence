import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    isVisible: PropTypes.bool.isRequired,
    isAnimatable: PropTypes.bool.isRequired,
    handleTransitionEnd: PropTypes.func.isRequired,
    children: PropTypes.node
}

class Drawer extends Component {
    constructor(props) {
        super(props);

        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    }

    handleTransitionEnd() {
        this.props.handleTransitionEnd();
    }

    addAnimationClasses() {
        const classes = [];

        if (this.props.isAnimatable) {
            classes.push('animatable');
        }
        
        if (this.props.isVisible) {
            classes.push('visible');
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

export default Drawer;