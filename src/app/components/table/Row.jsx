import React from "react";

function Row({ item, handleClick }) {
    const handleOnClick = () => {
        handleClick(item);
    };
    return (
        <tr className="simple-table__row grid grid--align-center">
            <td className="grid__col-10">{item.description}</td>
            <td className="grid__col-2">
                <button className="btn btn--info" onClick={handleOnClick}>
                    Add
                </button>
            </td>
        </tr>
    );
}
export default Row;
