import React from "react";

import PropTypes, {object} from "prop-types";

const styles = {
    STANDARD: "standard",
    GREEN: "green",
    BLUE: "blue",
    RED: "red"
};
const icons = {
    PERSON: "person",
    SHIELD_PERSON: "shield-person",
    SHIELD_TICK: "shield-tick"
};
const styleArray = Object.values(styles);
const iconArray = Object.values(icons);

const propTypes = {
    closeCallback: PropTypes.func,
    icon: PropTypes.oneOf(iconArray),
    link: PropTypes.string,
    style: PropTypes.oneOf(styleArray),
    text: PropTypes.string.isRequired
};
const Chip = props => {
    let icon;
    let iconColor;
    let chipClasses = "chip"
    switch (props.style) {
        case styles.STANDARD:
            iconColor = "#707071"
            break;
        case styles.BLUE:
            chipClasses += " chip--blue"
            iconColor = "#343B59"
            break;
        case styles.GREEN:
            chipClasses += " chip--green"
            iconColor = "#49725D"
            break;
        case styles.RED:
            chipClasses += " chip--red"
            iconColor = "#6D272B"
            break;
    }
    switch (props.icon) {
        case icons.SHIELD_PERSON:
            icon = (
                <svg width="12" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 .167 0 2.833v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8v-4L6 .167Zm2 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm1.858 5.007A4.704 4.704 0 0 0 6 8.167a4.704 4.704 0 0 0-3.858 2.007C2.99 11.749 4.383 12.956 6 13.428c1.617-.472 3.011-1.68 3.858-3.254Z"
                        fill={iconColor}
                    />
                </svg>
            );
            break;
        case icons.SHIELD_TICK:
            icon = (
                <svg width="12" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 .167 0 2.833v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8v-4L6 .167ZM4.667 10.833 2 8.167l.94-.94 1.727 1.72L9.06 4.553 10 5.5l-5.333 5.333Z"
                        fill={iconColor}
                    />
                </svg>
            );
            break;
        case icons.PERSON:
            icon = (
                <svg width="14" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.667 7.5a3.332 3.332 0 1 0 0-6.667 3.332 3.332 0 1 0 0 6.667Zm0 1.667C4.442 9.167 0 10.283 0 12.5v1.667h13.333V12.5c0-2.217-4.441-3.333-6.666-3.333Z"
                        fill={iconColor}
                    />
                </svg>
            );
            break;
    }

    const text = props.link ? <a className="chip__text" href={props.link}>{props.text}</a> : <span className="chip__text">{props.text}</span>;
    const close = <button className="" onClick={props.closeCallback}>x</button>;
    return (
        <div className={chipClasses}>
            <span>
                {props.icon && icon}
                {text}
                {props.closeCallback && close}
            </span>
        </div>
    );
};
Chip.propTypes = propTypes;
export default Chip;
