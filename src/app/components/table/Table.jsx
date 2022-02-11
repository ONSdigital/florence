import React from "react";
import Row from "./Row";

function Table({ items, handleClick }) {
    if (!items) return null;
    return (
        <table className="simple-table simple-table__no-padding">
            {items.map((item, key) => (
                <Row key={key} {...item} handleClick={handleClick} />
            ))}
        </table>
    );
}

export default Table;
