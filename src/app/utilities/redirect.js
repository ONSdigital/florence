import { browserHistory } from "react-router";
import { store } from "../config/store";

/**
 * Redirects to one of the main views in Florence - chooses whether it needs to redirect to old Florence or route within the new application
 *
 * @param {string} - The path of the view that we want to redirect to
 */

export default function handleRedirect(redirectPath) {
    if (!redirectPath) {
        internalRedirect();
        return;
    }

    const allowedExternalRedirects = store.getState().state.allowedRedirects;

    if (allowedExternalRedirects.some(path => redirectPath.startsWith(path))) {
        externalRedirect(redirectPath);
        return;
    }

    internalRedirect(redirectPath);
}

function internalRedirect(redirectPath) {
    const rootPath = store.getState().state.rootPath;

    if (!redirectPath) {
        browserHistory.push(`${rootPath}/collections`);
        return;
    }

    if (
        redirectPath.startsWith(`${rootPath}/collections`) ||
        redirectPath.startsWith(`${rootPath}/datasets`) ||
        redirectPath.startsWith(`${rootPath}/groups`) ||
        redirectPath.startsWith(`${rootPath}/security`) ||
        redirectPath.startsWith(`${rootPath}/teams`) ||
        redirectPath.startsWith(`${rootPath}/uploads`) ||
        redirectPath.startsWith(`${rootPath}/users`)
    ) {
        browserHistory.push(redirectPath);
        return;
    }

    if (redirectPath === `${rootPath}/publishing-queue` || redirectPath === `${rootPath}/reports` || redirectPath === `${rootPath}/workspace`) {
        window.location.href = redirectPath;
        return;
    }

    browserHistory.push(`${rootPath}/collections`);
}

function externalRedirect(redirectPath) {
    window.location.pathname = redirectPath;
    return;
}
