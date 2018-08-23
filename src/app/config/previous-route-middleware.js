import {LOCATION_CHANGE} from 'react-router-redux';

let previousPathname = "";
// let previousAction = undefined;
// let counter = 0;

export default () => next =>  action => {
    if (action.type === LOCATION_CHANGE) {
        // counter++;
        // console.log("Route change:", counter);
        // console.log("Previous action", previousAction);
        // console.log("Previous path:", previousPathname);
        // console.log("Previous previous path:", previousAction ? previousAction.previousPathname : undefined);
        // console.log("New path:", action.payload.pathname);
        // if (action.payload.action === "REPLACE") {
        //     console.log("RREEEEEPPPLLLLAAAACCCEEEE!!!!");
        // }
        // console.log("-------");
        const newAction = {
            ...action,
            payload: {
                ...action.payload,
                // previousPathname: action.payload.action === "REPLACE" ? previousAction.previousPathname : previousPathname,
                previousPathname,
                // previousAction: previousAction ? {
                //     pathname: previousAction.pathname,
                //     action: previousAction.action,
                //     previousPathname: previousAction ? previousAction.previousPathname : ""
                // } : undefined
            }
        };
        // if (action.payload.action !== "REPLACE") {
        //     previousAction = {
        //         pathname: action.payload.pathname,
        //         action: action.payload.action,
        //         previousPathname: previousAction ? previousAction.pathname : ""
        //     };
        // }
        previousPathname = action.payload.pathname;
        return next(newAction);
    }
    return next(action);
} 