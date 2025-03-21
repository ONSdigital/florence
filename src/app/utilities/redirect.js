import { browserHistory } from "react-router";
import { store } from "../config/store";

export default class redirect {
    /**
     * handle - chooses whether to redirect internally within Florence or to an external path
     *
     * @param {string} string path of the redirect
     *
     * @returns {action} performs either an internal or external redirect
     */
    static handle(redirectPath) {
        if (!redirectPath) {
            return internalRedirect();
        }

        const config = window.getEnv();
        const allowedExternalPaths = config.allowedExternalPaths;
        if (allowedExternalPaths.some(path => redirectPath.startsWith(path))) {
            return externalRedirect(redirectPath);
        }

        return internalRedirect(redirectPath);
    }

    /**
     * getPath returns the redirect path from the query string with the key 'redirect' or 'next'
     *
     * @param {object} query string object
     *
     * @returns {string} redirect path
     */
    static getPath(queryStr) {
        if (!queryStr) {
            return "";
        }

        if (queryStr.redirect && queryStr.next) {
            return "";
        }

        if (queryStr.redirect) {
            return queryStr.redirect;
        }

        if (queryStr.next) {
            return queryStr.next;
        }

        return "";
    }
}

function internalRedirect(redirectPath) {
    const rootPath = store.getState().state.rootPath;

    if (!redirectPath) {
        browserHistory.push(`${rootPath}/collections`);
        return;
    }

    if (
        redirectPath.startsWith(`${rootPath}/collections`) ||
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
    return;
}

function externalRedirect(redirectPath) {
    window.location.pathname = redirectPath;
    return;
}
