import React from "react";
import SelectableBoxController from "./SelectableBoxController.jsx";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

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

test("Selectable box with items renders component with all items", () => {
    const props = {
        heading: "Selectable box test",
        items,
        handleItemClick: function () {},
    };
    const component = renderer.create(<SelectableBoxController {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test("Clicking on a selectable item fires function from props to handle it", () => {
    let itemHasBeenClicked = false;
    const props = {
        heading: "Selectable box test - handle item click",
        items,
        handleItemClick: function (event) {
            itemHasBeenClicked = true;
        },
    };
    const component = mount(<SelectableBoxController {...props} />);
    expect(itemHasBeenClicked).toBe(false);
    const SelectableBoxItem = component.find({ name: "Item 2" });
    SelectableBoxItem.simulate("click");
    expect(itemHasBeenClicked).toBe(true);
});

test("Selectable box with active item renders correctly", () => {
    const activeItem = {
        name: "Item 3",
        id: "3",
    };
    const props = {
        heading: "Selectable box test - item selected",
        items,
        activeItem,
        handleItemClick: function () {},
    };
    const component = renderer.create(<SelectableBoxController {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
