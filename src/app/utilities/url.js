import log, {eventTypes} from '../utilities/log'

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
     * Takes a relative path and resolves it to an absolute path
     * 
     * @param {string} path - Path that we want to resolve 
     * @returns {string} - An absolute pathname (excluding host)
     */
    static resolve(path) {
        if (typeof path !== "string") {
            console.error("Unable to parse relative URL path because non-string type given");
            log.add(eventTypes.unexpectedRuntimeError, {message: "Unable to parse relative URL path because non-string type given"});
            return;
        }

        try {
            return new URL(path, location.href).pathname;
        } catch (error) {
            console.error("Error trying to parse relative URL:\n", error);
            log.add(eventTypes.unexpectedRuntimeError, {message: error.message});
            return path;
        }
    }
}