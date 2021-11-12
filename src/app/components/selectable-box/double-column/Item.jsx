import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Item = props => (
    <li id={props.id} className={clsx("selectable-box__item", { selected: props.isSelected })} onClick={() => props.handleClick(props.id)}>
        <div className="grid">
            <div className="grid__col-6">
                {props.selectableBox.firstColumn}
                {props.status.message && `[${props.status.message}]`}
            </div>
            <div className="grid__col-6">{props.selectableBox.secondColumn}</div>
        </div>
    </li>
);

export default Item;
