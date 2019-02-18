import validatePassword from "./validatePassword";

const validPassword = "foobar foobar barfoo barfoo";

describe("A valid password", () => {
    const validatedPassword = validatePassword(validPassword);

    it("returns an object with the properties 'isValid' and 'error'", () => {
        expect("isValid" in validatedPassword).toBe(true);
        expect("error" in validatedPassword).toBe(true);
    });

    it("returns isValid property as 'true'", () => {
        expect(validatedPassword.isValid).toBe(true);
    });

    it("returns error property as an empty string", () => {
        expect(validatedPassword.error).toBe("");
    });
});

describe("Missing password", () => {
    const validatedPassword = validatePassword("");

    it("returns an object with the properties 'isValid' and 'error'", () => {
        expect("isValid" in validatedPassword).toBe(true);
        expect("error" in validatedPassword).toBe(true);
    });

    it("returns isValid property as 'false'", () => {
        expect(validatedPassword.isValid).toBe(false);
    });

    it("returns an error message", () => {
        expect(validatedPassword.error).toBe("Passwords must contain four words and be at least 15 characters");
    });
});

describe("Passwords that are too short", () => {
    const validatedPassword = validatePassword("foo bar f b");

    it("returns an object with the properties 'isValid' and 'error'", () => {
        expect("isValid" in validatedPassword).toBe(true);
        expect("error" in validatedPassword).toBe(true);
    });

    it("returns isValid property as 'false'", () => {
        expect(validatedPassword.isValid).toBe(false);
    });

    it("returns an error message", () => {
        expect(validatedPassword.error).toBe("Passwords must contain at least 15 characters");
    });
});

describe("Passwords that are not four separate words", () => {
    const validatedPassword = validatePassword("foobarareallylongpassword");

    it("returns an object with the properties 'isValid' and 'error'", () => {
        expect("isValid" in validatedPassword).toBe(true);
        expect("error" in validatedPassword).toBe(true);
    });

    it("returns isValid property as 'false'", () => {
        expect(validatedPassword.isValid).toBe(false);
    });

    it("returns an error message", () => {
        expect(validatedPassword.error).toBe("Passwords must contain four words, separated by spaces");
    });
});