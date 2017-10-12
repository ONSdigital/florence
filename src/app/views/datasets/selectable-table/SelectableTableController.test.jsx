import React from 'react';
import SelectableTableController from './SelectableTableController.jsx';
import renderer from 'react-test-renderer';

const values = [
    {
        title: "CPI",
        date: "17-10-2017",
        datasetURL: "/florence/datasets/12345/metadata",
        instances: [
            {
                date: "",
                edition: "2016",
                version: "-",
                url: "/florence/datasets/12345/instances/6789/metdata"
            }
        ]
    }
]

test('Selectable table with values renders component with all values', () => {
    const component = renderer.create(
        <SelectableTableController 
            values={values}
        />
    );

    expect(component.toJSON()).toMatchSnapshot();
});