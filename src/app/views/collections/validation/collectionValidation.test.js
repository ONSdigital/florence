import collectionValidation from "./collectionValidation";
import { errCodes } from "../../../utilities/errorCodes";

describe("Validating the collection name", () => {
    const collections = [
        { id: "FooTest-123", name: "Foo Test" },
        { id: "Boo-123", name: "Boo" },
        { id: "test-123", name: "test2" },
        { id: "alphabeta-123", name: "alpha" },
    ];

    it("returns 'false' if the collection name is missing", () => {
        expect(collectionValidation.name("").isValid).toBe(false);
    });

    it("returns 'false' if the collection name is just whitespace", () => {
        expect(collectionValidation.name("   ").isValid).toBe(false);
    });

    it("returns 'false' if the collection name contains symbol", () => {
        expect(collectionValidation.name("My-collection@$").isValid).toBe(false);
    });

    it("returns an error message if the collection name isn't valid", () => {
        expect(collectionValidation.name("").errorMsg).toBeTruthy();
    });

    it("doesn't return an error message if the collection name is valid", () => {
        expect(collectionValidation.name("My collection").errorMsg).toBeFalsy();
    });

    it("returns 'true' if the collection name is valid", () => {
        expect(collectionValidation.name("My collection").isValid).toBe(true);
    });

    it("returns false isValid and an error message if the collection name is already taken", () => {
        expect(collectionValidation.name("Foo Test", collections).errorMsg).toBe(errCodes.UNIQ_ID_NAME_ERROR);
        expect(collectionValidation.name("Foo Test", collections).isValid).toBe(false);
    });

    it("returns true and no error message if the collection name isn't in collections array", () => {
        expect(collectionValidation.name("Bar", collections).errorMsg).toBeFalsy();
        expect(collectionValidation.name("Bar", collections).isValid).toBe(true);
    });

    it("returns false and error message if the collection name difference with white space only", () => {
        expect(collectionValidation.name("Foo Test ", collections).errorMsg).toBe(errCodes.UNIQ_ID_NAME_ERROR);
        expect(collectionValidation.name("Foo Test ", collections).isValid).toBe(false);
    });

    it("returns false isValid and an error message if the collection id prefix is already taken", () => {
        expect(collectionValidation.name("test", collections).errorMsg).toBe(errCodes.UNIQ_ID_NAME_ERROR);
        expect(collectionValidation.name("test", collections).isValid).toBe(false);
        expect(collectionValidation.name("alpha beta", collections).errorMsg).toBe(errCodes.UNIQ_ID_NAME_ERROR);
        expect(collectionValidation.name("alpha beta", collections).isValid).toBe(false);
    });
});

describe("Validating the collection publish date", () => {
    it("returns 'false' if the publish date is missing for a scheduled collection", () => {
        expect(collectionValidation.date("").isValid).toBe(false);
    });

    it("returns 'true' if a date is given but the publish type is missing", () => {
        expect(collectionValidation.date("2018-16-07").isValid).toBe(true);
    });

    it("returns 'true' if the publish date is valid", () => {
        expect(collectionValidation.date("2018-16-07").isValid).toBe(true);
    });

    it("returns an error message if the publish date isn't valid", () => {
        expect(collectionValidation.date("").errorMsg).toBeTruthy();
    });

    it("doesn't return an error message if the publish date is valid", () => {
        expect(collectionValidation.date("").errorMsg).toBeTruthy();
    });
});

describe("Validating the collection publish time", () => {
    it("returns 'false' if the publish time is missing", () => {
        expect(collectionValidation.time("").isValid).toBe(false);
    });

    it("returns 'true' if the publish time is valid", () => {
        expect(collectionValidation.time("09:30").isValid).toBe(true);
    });

    it("returns an error message if the publish time isn't valid", () => {
        expect(collectionValidation.time("").errorMsg).toBeTruthy();
    });

    it("doesn't return an error message if the publish time is valid", () => {
        expect(collectionValidation.time("09:30").errorMsg).toBeFalsy();
    });
});

describe("Validating the collection publish type", () => {
    it("returns 'false' if the publish type is missing", () => {
        expect(collectionValidation.type("").isValid).toBe(false);
    });

    it("returns 'false' if the publish type doesn't match a valid type", () => {
        expect(collectionValidation.type("foobar").isValid).toBe(false);
    });

    it("returns 'true' if the publish type is valid", () => {
        expect(collectionValidation.type("scheduled").isValid).toBe(true);
        expect(collectionValidation.type("manual").isValid).toBe(true);
    });

    it("returns an error message if the publish type isn't valid", () => {
        expect(collectionValidation.type("foobar").errorMsg).toBeTruthy();
    });

    it("doesn't return an error message if the publish type is valid", () => {
        expect(collectionValidation.type("manual").errorMsg).toBeFalsy();
        expect(collectionValidation.type("scheduled").errorMsg).toBeFalsy();
    });
});
