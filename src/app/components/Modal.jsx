import React, { Component} from 'react';

const defaultProps = {
    sizeClass: "grid__col-3"
};

export default class Modal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal__overlay">
                <div className={"modal__inner " + this.props.sizeClass}>
                    {this.props.children}
                </div>
            </div>
        )
    }

}

Modal.defaultProps = defaultProps;