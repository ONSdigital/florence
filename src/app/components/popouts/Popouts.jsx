import React from "react";
import PropTypes from "prop-types";
import PopoutItem from "./PopoutItem";
import Modal from "../Modal";

const propTypes = {
    popouts: PropTypes.arrayOf(PropTypes.shape(PopoutItem.propTypes)).isRequired,
};

const Popouts = props => {
    if (props.popouts.length === 0) return null;
    ``;

    const modalChild = (
        <div className="">
            {props.popouts.map(popout => {
                return <PopoutItem {...popout} key={popout.id} />;
            })}
        </div>
    );
    return <Modal children={modalChild} sizeClass="grid__col-4" />;
};

Popouts.propTypes = propTypes;
export default Popouts;
