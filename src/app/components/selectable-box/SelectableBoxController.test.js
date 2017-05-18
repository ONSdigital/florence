import React from 'react';
import SelectableBoxController from './SelectableBoxController.jsx';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

test('Selectable box with items renders component with all items', () => {
    const items = [
        {
            name: "Item 1",
            id: "1"
        },
        {
            name: "Item 2",
            id: "2"
        },
        {
            name: "Item 3",
            id: "3"
        }
    ];
    const props = {
        heading: "Selectable box test",
        items,
        handleItemClick: function() {}
    };
    const component = renderer.create(
        <SelectableBoxController {...props} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test('Selectable box with active item renders correctly', () => {
    const items = [
        {
            name: "Item 1",
            id: "1"
        },
        {
            name: "Item 2",
            id: "2"
        },
        {
            name: "Item 3",
            id: "3"
        }
    ];
    const activeItem = {
        name: "Item 3",
        id: "3"
    };
    const props = {
        heading: "Selectable box test - item selected",
        items,
        activeItem,
        handleItemClick: function() {}
    };
    const component = renderer.create(
        <SelectableBoxController {...props} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});