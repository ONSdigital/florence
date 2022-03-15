import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Modal = ({ children, sizeClass = "grid__col-3" }) => {
    return (
        <div className="modal__overlay">
            <div className={clsx("modal__inner", sizeClass)}>{children}</div>
        </div>
    );
};

Modal.propTypes = {
    children: PropTypes.node,
    sizeClass: PropTypes.string,
};

export default Modal;
