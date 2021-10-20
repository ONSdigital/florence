import { LOCATION_CHANGE } from "react-router-redux";

let previousPathname = "";

export default () => next => action => {
    if (action.type === LOCATION_CHANGE) {
        const newAction = {
            ...action,
            payload: {
                ...action.payload,
                previousPathname,
            },
        };
        previousPathname = action.payload.pathname;
        return next(newAction);
    }
    return next(action);
};
