import React from 'react';
import SelectableTableController from './SelectableTableController.jsx';
import renderer from 'react-test-renderer';

jest.mock('../../../utilities/url', () => {
    return {
        resolve: function() {
            //
        },
        parent: function() {}
    }
});

const values = [
    {
        title: "CPI",
        date: "17-10-2017",
        datasetURL: "/florence/datasets/12345/metadata",
        instances: [
            {
                date: "Tue Oct 17 2017 17:11:59",
                edition: "2016",
                version: "-",
                url: "/florence/datasets/12345/instances/6789/metdata"
            }
        ],
        id: "meeeeeh",
        status: "completed"
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