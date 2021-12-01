import React from "react";
import PropTypes from "prop-types";
import PersonInShield from "../../icons/PersonInShield";
import TickInShield from "../../icons/TickInShield";
import Person from "../../icons/Person";

const propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
    icon: PropTypes.oneOf(["Cross", "Person", "PersonInShield", "TickInShield", "Warning"]),
    iconColor: PropTypes.oneOf(["standard", "blue", "green", "red"]),
    iconName: PropTypes.string,
    buttonName: PropTypes.string,
    buttonCallback: PropTypes.func,
};

const DynamicListItem = props => {
    const colorBlack = "#000000";
    const viewBox = "0 0 15 15";
    let icon;
    switch (props.icon) {
        case "Shield-person":
            icon = <PersonInShield classes="dynamic-list-item__icon" viewBox={viewBox} fillColor={colorBlack} ariaLabel={props.iconName} />;
            break;
        case "Shield-tick":
            icon = <TickInShield classes="dynamic-list-item__icon" viewBox={viewBox} fillColor={colorBlack} ariaLabel={props.iconName} />;
            break;
        case "Person":
            icon = <Person classes="dynamic-list-item__icon" viewBox={viewBox} fillColor={colorBlack} ariaLabel={props.iconName} />;
            break;
    }
    return (
        <li className="dynamic-list-item">
            {icon}
            <span className="dynamic-list-item__title">{props.title}</span>
            {props.desc && (
                <>
                    <span className="dynamic-list-item__separator" aria-hidden="true">
                        {" "}
                        •{" "}
                    </span>
                    <span className="dynamic-list-item__desc">{props.desc}</span>
                </>
            )}
            {props.buttonName && (
                <button
                    type="button"
                    className="dynamic-list-item__btn"
                    onClick={props.buttonCallback}
                    aria-label={`${props.buttonName} ${props.title}`}
                >
                    {props.buttonName}
                </button>
            )}
        </li>
    );
};
DynamicListItem.propTypes = propTypes;
export default DynamicListItem;
