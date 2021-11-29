import React from "react";
import clsx from "clsx";

const Loader = ({ classNames }) => (
    <div className={clsx(classNames)}>
        <div className="loader loader--large loader--dark" />
    </div>
);

export default Loader;
