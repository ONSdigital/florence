export default function validatePassword(password) {
    if (!password) {
        return {
            isValid: false,
            error: "Passwords must contain 4 words and be at least 15 characters"
        }
    }

    if (!password.match(/.+\s.+\s.+\s.+/)) {
        return {
            isValid: false,
            error: "Passwords must contain 4 words, separated by spaces"
        };
    }

    if (password.length <= 15 ) {
        return {
            isValid: false,
            error: "Passwords must contain at least 15 characters"
        };
    }

    return {
        isValid: true,
        error: ""
    }
}