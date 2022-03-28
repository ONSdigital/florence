import React from "react";
import Row from "./Row";

function Table({ items, testid, handleClick }) {
    if (!items) return null;
    if (items.length === 0) return <p>Nothing to show.</p>;

    return (
        <table role="table" className="simple-table simple-table__scroll" data-testid={testid}>
            <tbody>
                {items.map((item, i) => (
                    <Row key={`${i}-${item.id || item.group_name}`} item={item} handleClick={handleClick} />
                ))}
            </tbody>
        </table>
    );
}

export default Table;
