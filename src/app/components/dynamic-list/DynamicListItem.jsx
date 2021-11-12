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
    buttonName: PropTypes.string,
    buttonCallback: PropTypes.func
}

const DynamicListItem = props => {
    let icon
    const colorBlack = "#000000";
    switch (props.icon) {
        case "Shield-person":
            icon = <PersonInShield classes="chip__icon dynamic-list-item__icon" viewBox={"0 0 15 15"} fillColor={colorBlack}
                                   ariaLabel={"Person inside shield icon"}/>;
            break;
        case "Shield-tick":
            icon = <TickInShield classes="chip__icon dynamic-list-item__icon" viewBox={"0 0 15 15"} fillColor={colorBlack}
                                 ariaLabel={"Tick inside shield icon"}/>;
            break;
        case "Person":
            icon = <Person classes="chip__icon dynamic-list-item__icon" viewBox={"0 0 15 15"} fillColor={colorBlack} ariaLabel={"Person icon"}/>;
            break;
    }
    return (<li className="dynamic-list-item">
        {props.icon && <span>{icon}</span>}
        <span className="dynamic-list-item__title">{props.title}</span>
        {props.desc && <span> • {props.desc}</span>}
        {props.buttonName && <button className="dynamic-list-item__btn" onClick={props.buttonCallback}>{props.buttonName}</button>}
    </li>)
};
DynamicListItem.propTypes = propTypes;
export default DynamicListItem;
