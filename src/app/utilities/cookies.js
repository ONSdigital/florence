export default class cookies {
    static getAll() {
        const cookies = document.cookie.split(";");
        const cookiesObject = {};

        cookies.forEach(cookie => {
            const parts = cookie.split("=");
            cookiesObject[parts[0].trim()] = parts[1];
        });
        return cookiesObject;
    }

    /**
     * Adds a cookie on the client's machine
     *
     * @param name - mandatory field for the name of the cookie to set
     * @param value - mandatory field for the value the should hold
     * @param cookieAttributes - all non-mandatory fields such as path, domain, SameSite, Secure etc
     * @returns {boolean} if error occurs will return false
     */
    static add(name, value, cookieAttributes) {
        cookieAttributes = cookieAttributes || {};
        if (!this.checkHasAllMandatoryAddFields(name, value)) {
            return false;
        }
        if (!cookieAttributes.path) {
            cookieAttributes.path = `/`;
        }
        if (!cookieAttributes.domain) {
            cookieAttributes.domain = location.hostname;
        }
        let cookie = `${name}=${value};path=${cookieAttributes.path};domain=${cookieAttributes.domain}`;
        if (cookieAttributes.sameSite != null) {
            cookie += `; SameSite=${cookieAttributes.sameSite}`;
        }
        if (cookieAttributes.secure) {
            cookie += `; Secure`;
        }
        document.cookie = cookie;
    }

    static checkHasAllMandatoryAddFields(name, value) {
        if (!name || typeof name !== "string") {
            console.error(`cookie.add() requires a cookie name (type=string) as an argument`);
            return false;
        }
        if (!value) {
            console.error(`cookie.add() requires a cookie value as an argument`);
            return false;
        }
        return true;
    }

    static get(name) {
        if (!name || typeof name !== "string") {
            console.error(`cookie.get() requires a cookie name (type=string) as an argument`);
            return false;
        }
        const allCookies = this.getAll();
        const cookie = allCookies[name];

        if (!cookie) {
            return false;
        }

        return cookie;
    }

    static remove(name) {
        if (!name || typeof name !== "string") {
            console.error(`cookie.get() requires a cookie name (type=string) as an argument`);
            return false;
        }
        if (!this.get(name)) {
            console.error(`Unable to find '${name}' cookie`);
            return false;
        }
        document.cookie = `${name}=;path=/;domain=${location.hostname};expires=Thu, 01 Jan 1970 00:00:01 GMT;'`;
        console.log(`Removed cookie: '${name}'`);
        return true;
    }
}
