import { fromPairs } from "lodash";
import { browserHistory } from "react-router";
import { store } from "../config/store";
import fp from "lodash/fp";

/**
 * Redirects to one of the main views in Florence - chooses whether it needs to redirect to old Florence or route within the new application
 *
 * @param {string} - The path of the view that we want to redirect to
 */

export default function redirectToMainScreen(screen) {
    const rootPath = store.getState().state.rootPath;

    if (!screen) {
        browserHistory.push(`${rootPath}/collections`);
        return;
    }

    if (
        screen.startsWith(`${rootPath}/teams`) ||
        screen.startsWith(`${rootPath}/datasets`) ||
        screen.startsWith(`${rootPath}/collections`) ||
        screen.startsWith(`${rootPath}/users`)
    ) {
        browserHistory.push(screen);
        return;
    }

    if (screen === `${rootPath}/publishing-queue` || screen === `${rootPath}/reports` || screen === `${rootPath}/workspace`) {
        window.location.href = screen;
        return;
    }

    browserHistory.push(`${rootPath}/collections`);
}

export function getPreviousPathnameFromProps(props) {
    return fp.get("router.location.previousPathname")(props);
}
