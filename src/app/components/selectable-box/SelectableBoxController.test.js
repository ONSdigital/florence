import React from "react";
import SelectableBoxController from "./SelectableBoxController";
import renderer from "react-test-renderer";
import { mount } from "enzyme";

const items = [
    {
        name: "Item 1",
        id: "1",
    },
    {
        name: "Item 2",
        id: "2",
    },
    {
        name: "Item 3",
        id: "3",
    },
];
const fnMock = jest.fn();

describe("SelectableBoxController", () => {
    describe("when items are passed ", () => {
        it("matches snapshot", () => {
            const props = {
                heading: "Selectable box test",
                items,
                handleItemClick: fnMock,
            };
            const component = renderer.create(<SelectableBoxController {...props} />);

            expect(component.toJSON()).toMatchSnapshot();
        });
    });
    describe("when active item is passed ", () => {
        it("matches snapshot", () => {
            const activeItem = {
                name: "Item 3",
                id: "3",
            };
            const props = {
                heading: "Selectable box test - item selected",
                items,
                activeItem,
                handleItemClick: fnMock,
            };
            const component = renderer.create(<SelectableBoxController {...props} />);

            expect(component.toJSON()).toMatchSnapshot();
        });
    });

    it("fires function from props to handle click on item", () => {
        let itemHasBeenClicked = false;
        const props = {
            heading: "Selectable box test - handle item click",
            items,
            handleItemClick: function () {
                itemHasBeenClicked = true;
            },
        };
        const component = mount(<SelectableBoxController {...props} />);
        expect(itemHasBeenClicked).toBe(false);
        const SelectableBoxItem = component.find({ name: "Item 2" });
        SelectableBoxItem.simulate("click");
        expect(itemHasBeenClicked).toBe(true);
    });

    describe("when there are not items", () => {
        it("displays message", () => {
            const props = {
                heading: "",
                items: [],
                handleItemClick: fnMock,
            };
            const component = mount(<SelectableBoxController {...props} />);
            expect(component.text()).toBe("No items to display");
        });
    });
});
