import React from "react";

const Panel = props => {
    // <dl className={"panel panel--warning"}>
    //     <dt className={"panel__heading"}>Fix the following:</dt>
    //     <dd className={"panel__description"}>Email address or password are incorrect</dd>
    // </dl>
    return (
        <dl className={"panel panel--error margin-top--0"}>
            <dt className={"panel__heading"}>Fix the following:</dt>
            <dd className={"panel__description"}>Email address or password are incorrect</dd>
        </dl>
    );
};
export default Panel;
