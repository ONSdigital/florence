import React from "react";
import PropTypes from "prop-types";
import PopoutItem from "./PopoutItem";
import Modal from "../Modal";

const Popouts = ({ popouts }) => {
    if (popouts.length === 0) {
        return null;
    }

    return (
        <Modal sizeClass="grid__col-4">
            {popouts.map(popout => (
                <PopoutItem {...popout} key={popout.id} />
            ))}
        </Modal>
    );
};

Popouts.propTypes = { popouts: PropTypes.array.isRequired };
export default Popouts;
