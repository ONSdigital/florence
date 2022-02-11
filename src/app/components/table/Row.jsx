import React from "react";

function Row(props) {
    console.log("Row", props);
    return (
        <row className="simple-table__row grid grid--align-center">
            <td className="grid__col-10">{props.group_name}</td>
            <td className="grid__col-2">
                <button className="btn btn--subtle" onClick={props.handleClick}>
                    Add
                </button>
            </td>
        </row>
    );
}
export default Row;
