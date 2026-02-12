import cookies from "./cookies";

const ADMIN_GROUP = "role-admin";
const EDITOR_GROUP = "role-publisher";
const ID_TOKEN_NAME = "id_token";

export class UserIDToken {
    static #decodeJwtPayload(token) {
        if (!token || typeof token !== "string") {
            return undefined;
        }
        const tokenParts = token.split(".");
        if (tokenParts.length < 2) {
            return undefined;
        }
        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        try {
            const jsonPayload = atob(padded);
            return JSON.parse(jsonPayload);
        } catch (err) {
            console.warn("Unable to decode token payload", err);
            return undefined;
        }
    }

    static #getPropertyFromPayload(payload, propertyName) {
        return payload[propertyName];
    }

    static #getGroups(payload) {
        const groups = this.#getPropertyFromPayload(payload, "cognito:groups");
        return Array.isArray(groups) ? groups : [];
    }

    static #hasRequiredGroup(payload, requiredGroup) {
        const groups = this.#getGroups(payload);
        return groups.includes(requiredGroup);
    }

    //TODO use this once we have fully switched over.
    static #getEmail(payload) {
        return this.#getPropertyFromPayload(payload, "email");
    }

    static #getID(payload) {
        return this.#getPropertyFromPayload(payload, "cognito:username");
    }

    static #isAdmin = payload => this.#hasRequiredGroup(payload, ADMIN_GROUP);
    static #isEditor = payload => this.#hasRequiredGroup(payload, EDITOR_GROUP);

    static getPermissions = () => {
        const token = cookies.get(ID_TOKEN_NAME);
        if (!token) {
            console.error("Error getting user id token");
            return undefined;
        }

        const payload = this.#decodeJwtPayload(token);
        if (!payload) {
            console.error("Error decoding user id token");
            return undefined;
        }

        console.log(payload);

        const permissions = {
            admin: this.#isAdmin(payload),
            editor: this.#isEditor(payload),
            //TODO: change this over to actual email later post migration.
            email: this.#getID(payload),
        };

        return permissions;
    };
}
