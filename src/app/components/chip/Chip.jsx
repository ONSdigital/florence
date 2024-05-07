import React from "react";

import PropTypes from "prop-types";
import PersonInShield from "../../icons/PersonInShield";
import TickInShield from "../../icons/TickInShield";
import Person from "../../icons/Person";

const propTypes = {
    icon: PropTypes.oneOf(["person", "shield-person", "shield-tick"]),
    link: PropTypes.string,
    removeFunc: PropTypes.func,
    style: PropTypes.oneOf(["standard", "green", "blue", "red"]),
    text: PropTypes.string.isRequired,
    testId: PropTypes.string,
    readOnly: PropTypes.bool,
};

const Chip = props => {
    let icon;
    let iconColor;
    let chipClasses = props.link ? "chip chip--clickable" : "chip";

    if (props.style != null && props.style !== "standard") {
        chipClasses += ` chip--${props.style}`;
    }

    switch (props.style) {
        case "standard":
            iconColor = "#707071"; // Grey2
            break;
        case "blue":
            iconColor = "#003c57"; // night-blue
            break;
        case "green":
            iconColor = "#0F8243"; // leaf-green
            break;
        case "red":
            iconColor = "#6D272B"; // tawny-port
            break;
    }

    switch (props.icon) {
        case "shield-person":
            icon = <PersonInShield classes="chip__icon" viewBox={"0 0 15 15"} fillColor={iconColor} ariaLabel={"Person inside shield icon"} />;
            break;
        case "shield-tick":
            icon = <TickInShield classes="chip__icon" viewBox={"0 0 15 15"} fillColor={iconColor} ariaLabel={"Tick inside shield icon"} />;
            break;
        case "person":
            icon = <Person classes="chip__icon" viewBox={"0 0 15 15"} fillColor={iconColor} ariaLabel={"Person icon"} />;
            break;
    }

    const text =
        props.link != null ? (
            <a href={props.link} className="chip__text">
                {props.text}
            </a>
        ) : (
            <span className="chip__text">{props.text}</span>
        );

    const handleOnClick = () => {
        if (props.member) props.removeFunc(props.member);

        if (props.id) return props.removeFunc(props.id);

        props.removeFunc();
    };

    return (
        <span data-testid={props.testId} className={chipClasses}>
            {props.icon && icon}
            {text}
            {!props.readOnly && props.removeFunc && (
                <span className="chip__remove-container">
                    <button aria-label="remove" className="chip__remove" onClick={handleOnClick} />
                </span>
            )}
        </span>
    );
};
Chip.propTypes = propTypes;
export default Chip;
