import React from "react";
import clsx from "clsx";

const Loader = ({ classNames }) => (
    <div data-testid="loader" className={clsx(classNames)}>
        <div className="loader loader--large loader--dark" />
    </div>
);

export default Loader;
