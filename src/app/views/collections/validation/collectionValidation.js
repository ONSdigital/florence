/**
 * validates collection data
 * 
 * @returns {object{isValid: boolean, errorMsg: string}} - Returns object with isValid boolean and an optional error message of why it's not valid
 */

export default class collectionValidation {

    static name(name) {
        if (!name || name.length <= 0) {
            return {
                isValid: false,
                errorMsg: "Collections must be given a name"
            }
        }

        return {
            isValid: true,
            errorMsg: ""
        };
    }

    static date(date, publishType) {
        if (publishType === "scheduled" && !date) {
            return {
                isValid: false,
                errorMsg: "Scheduled collections must be given a publish date"
            };
        }

        return {
            isValid: true,
            errorMsg: ""
        };
    }
    
    static time(time, publishType) {
        if (publishType === "scheduled" && !time) {
            return {
                isValid: false,
                errorMsg: "Scheduled collections must be given a publish time"
            };
        }

        return {
            isValid: true,
            errorMsg: ""
        };
    }

    static type(publishType) {
        if (!publishType) {
            return {
                isValid: false,
                errorMsg: "Collections must have a publish type"
            }
        }
    }
}