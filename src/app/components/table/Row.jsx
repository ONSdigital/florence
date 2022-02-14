import React from "react";

function Row(props) {
    return (
        <tr className="simple-table__row grid grid--align-center">
            <td className="grid__col-10">{props.group_name}</td>
            <td className="grid__col-2">
                <button className="btn btn--subtle" onClick={() => props.handleClick(props.group_name)}>
                    Add
                </button>
            </td>
        </tr>
    );
}
export default Row;
