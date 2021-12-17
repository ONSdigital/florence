import React from "react";
import renderer from "react-test-renderer";
import Sort from "./Sort";

describe("Sort", () => {
    // this component is dummy atm so checking snapshot is sufficient for regression checks only
    it("renders correctly with active class", () => {
        const props = {
            active: { key: "foo", direction: "ASC" },
            name: "foo",
        };
        const tree = renderer.create(<Sort {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly without active class", () => {
        const props = {
            active: { key: "boo", direction: "DESC" },
            name: "foo",
        };
        const tree = renderer.create(<Sort {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
