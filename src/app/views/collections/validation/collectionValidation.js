/**
 * validates collection data
 *
 * @returns {object{isValid: boolean, errorMsg: string}} - Returns object with isValid boolean and an optional error message of why it's not valid
 */

export default class collectionValidation {
    static name(name) {
        let response = {
            isValid: true,
            errorMsg: "",
        };

        if (name.match(/[^a-zA-Z0-9 ]/)) {
            response = {
                isValid: false,
                errorMsg: "Collection names can only contain letters and numbers. (" + name.replace(/[a-zA-Z0-9 ]/g, "") + ") are not allowed.",
            };
        }

        if (!name || name.match(/^\s*$/)) {
            response = {
                isValid: false,
                errorMsg: "Collections must be given a name",
            };
        }

        return response;
    }

    static date(date) {
        if (!date) {
            return {
                isValid: false,
                errorMsg: "Scheduled collections must be given a publish date",
            };
        }

        return {
            isValid: true,
            errorMsg: "",
        };
    }

    static time(time) {
        if (!time) {
            return {
                isValid: false,
                errorMsg: "Scheduled collections must be given a publish time",
            };
        }

        return {
            isValid: true,
            errorMsg: "",
        };
    }

    static release(release) {
        if (!release.uri) {
            return {
                isValid: false,
                errorMsg: "Must select a release",
            };
        }

        return {
            isValid: true,
            errorMsg: "",
        };
    }

    static type(publishType) {
        if (!publishType) {
            return {
                isValid: false,
                errorMsg: "Collections must have a publish type",
            };
        }

        if (publishType !== "manual" && publishType !== "scheduled") {
            return {
                isValid: false,
                errorMsg: "Collections must have a publish type",
            };
        }

        return {
            isValid: true,
            errorMsg: "",
        };
    }
}
