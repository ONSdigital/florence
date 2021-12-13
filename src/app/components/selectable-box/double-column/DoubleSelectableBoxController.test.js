import React from "react";
import DoubleSelectableBoxController from "./DoubleSelectableBoxController";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import { items } from "../../../../tests/mockData";

const props = {
    headings: ["Foo", "Bar"],
    items,
    activeItemID: items[1].id,
    isUpdating: false,
    search: "baz",
    handleItemClick: jest.fn(),
};

describe("DoubleSelectableBoxController", () => {
    it("matches the snapshot", () => {
        const component = renderer.create(<DoubleSelectableBoxController {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });

    describe("when there are not items", () => {
        it("displays message about search result if search props is passed", () => {
            const emptyProps = {
                ...props,
                items: [],
            };
            const component = shallow(<DoubleSelectableBoxController {...emptyProps} />);
            expect(component.text()).toEqual(
                "FooBarCannot find collectionImprove your results by:double-checking your spellingsearching for something less specific"
            );
        });
        it("displays generic message", () => {
            const emptyProps = {
                ...props,
                search: "",
                items: [],
            };
            const component = shallow(<DoubleSelectableBoxController {...emptyProps} />);
            expect(component.text()).toEqual("FooBarNo items to display");
        });
    });
});
