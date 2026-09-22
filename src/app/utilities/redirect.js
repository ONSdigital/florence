import { store, baseHistory as history } from "../config/store";

export default class redirect {
    /**
     * handle - chooses whether to redirect internally within Florence or to an external path
     *
     * @param {string} string path of the redirect
     *
     * @returns {action} performs either an internal or external redirect
     */
    static handle(redirectPath) {
        const sanitisedRedirectPath = sanitiseRedirectPath(redirectPath);
        if (!sanitisedRedirectPath) {
            return internalRedirect();
        }

        let baseRedirectPath = "";
        const redirectPathArray = sanitisedRedirectPath.split("/");
        // only interested in the first part of the path that is a string
        // e.g. a path of /path/here would be pathArray[0] = "", pathArray[1] = "path", pathArray[2] = "here"
        for (let i = 0; i < redirectPathArray.length; i++) {
            if (redirectPathArray[i] !== "") {
                baseRedirectPath = redirectPathArray[i];
                break;
            }
        }

        const config = window.getEnv();
        const allowedExternalPaths = config.allowedExternalPaths;
        if (allowedExternalPaths.includes(baseRedirectPath) || allowedExternalPaths.includes(`/${baseRedirectPath}`)) {
            return externalRedirect(sanitisedRedirectPath);
        }

        return internalRedirect(sanitisedRedirectPath);
    }

    /**
     * getPath returns the redirect path from the query string with the key 'redirect' or 'next'
     *
     * @param {object} query string object
     *
     * @returns {string} redirect path
     */
    static getPath(queryParams) {
        if (!queryParams) {
            return "";
        }

        const redirect = queryParams.get("redirect");
        const next = queryParams.get("next");

        if (redirect && next) {
            return "";
        }

        if (redirect) {
            return redirect;
        }

        if (next) {
            return next;
        }

        return "";
    }
}

function sanitiseRedirectPath(redirectPath) {
    if (typeof redirectPath !== "string") {
        return "";
    }
    let decodedPath;

    try {
        decodedPath = decodeURIComponent(redirectPath);
    } catch {
        return "";
    }

    const trimmedPath = decodedPath.trim();
    if (!trimmedPath) {
        return "";
    }
    // Must be to relative path
    if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://") || trimmedPath.startsWith("//")) {
        return "";
    }
    // Must not contain any backslashes
    if (trimmedPath.includes("\\")) {
        return "";
    }
    // Ensure the path starts with a leading slash
    const pathWithLeadingSlash = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
    try {
        return new URL(pathWithLeadingSlash, window.location.origin).pathname;
    } catch {
        return "";
    }
}

function isAllowedInternalPath(redirectPath, rootPath) {
    const allowedPrefixes = [
        `${rootPath}/collections`,
        `${rootPath}/groups`,
        `${rootPath}/security`,
        `${rootPath}/teams`,
        `${rootPath}/uploads`,
        `${rootPath}/users`,
    ];
    return allowedPrefixes.some(prefix => redirectPath === prefix || redirectPath.startsWith(`${prefix}/`));
}

function internalRedirect(redirectPath) {
    const rootPath = store.getState().state.rootPath;

    if (!redirectPath) {
        if (store.getState().state.config.enableSystemNavBar) {
            history.push(`${rootPath}/systems`);
            return;
        } else {
            history.push(`${rootPath}/collections`);
        }
        return;
    }

    if (isAllowedInternalPath(redirectPath, rootPath)) {
        history.push(redirectPath);
        return;
    }

    if (redirectPath === `${rootPath}/publishing-queue` || redirectPath === `${rootPath}/workspace`) {
        window.location.href = redirectPath;
        return;
    }

    history.push(`${rootPath}/collections`);
    return;
}

function externalRedirect(redirectPath) {
    window.location.href = new URL(redirectPath, window.location.origin).toString();
    return;
}
