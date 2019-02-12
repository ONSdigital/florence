import log from '../utilities/logging/log';
import notifications from './notifications';

export default class url {
    /**
    * Makes a safe URL by removing non a-z and 0-9 characters, replacing them with an '_'
    * 
    * @param {string} - String of proposed URL or URL part
    * @returns {string}
    */
    static sanitise(url) {
        const safeURL = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        return encodeURIComponent(safeURL);
    }

    /**
     * Slugifies the url (e.g. for when we want to use the URI as an ID in Florence's routing)
     * 
     * @param {string} - A URI
     * @return {string} - The URI safely slugified
     */
    static slug(url) {
        if (url.startsWith('/')) {
            return url.replace('/', '').replace(/\//g, '-');
        }

        return url.replace(/\//g, '-');
    }


    /**
     * Takes a relative path and resolves it to an absolute path (root is considered '/florence', so the returned path will always be prefixed with this)
     * 
     * @param {string} path - Path that we want to resolve 
     * @returns {string} - An absolute pathname (excluding host)
     */
    static resolve(path, excludeParameters) {

        if (typeof path !== "string") {
            console.error("Unable to parse relative URL path because non-string type given");
            log.event("Unable to parse relative URL path because non-string type given", log.data({type: typeof path}));
            return location.pathname;
        }

        try {
            // Handle URL for root - prefix it with '/florence'
            if (path === '/') {
                return '/florence';
            }
            if (path[0] === '/') {
                path = '/florence' + path;
            }
            if (location.pathname === "/florence") {
                path = '/florence/' + path;
            }

            // Handle paths going up levels, so that it considers any route
            // not ending in '/' to still be within that directory
            // e.g. url.resolve("../") from location "/florence/teams" = "/florence";
            if (path.indexOf('../') === 0) {
                const URLObject = new URL(path, location.href + "/");
                return URLObject.pathname.replace(/\/+$/, "") + (excludeParameters ? "" : URLObject.search);
            }

            const URLObject = new URL(path, location.href);
            const newURL = URLObject.pathname + (excludeParameters ? "" : URLObject.search);

            return newURL;
        } catch (error) {
            console.error("Error trying to parse relative URL:\n", error);
            const notification = {
                type: "warning",
                message: `There was an unexpected error trying to resolve the path '${path}' ... ¯\\_(ツ)_/¯`
            };
            notifications.add(notification);
            log.event("Error trying to parse relative URL", log.error(error))
            return;
        }
    }
}