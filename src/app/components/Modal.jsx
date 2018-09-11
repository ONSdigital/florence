import React, { Component} from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

const defaultProps = {
    sizeClass: "grid__col-3"
};

const propTypes = {
    children: PropTypes.node,
    sizeClass: PropTypes.string
}

export default class Modal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FocusTrap>
                <div className="modal__overlay">
                    <div className={"modal__inner " + this.props.sizeClass}>
                        {this.props.children}
                    </div>
                </div>
            </FocusTrap>
        )
    }

}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;