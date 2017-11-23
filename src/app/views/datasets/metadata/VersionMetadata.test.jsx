import React from 'react';
import {VersionMetadata} from './VersionMetadata.jsx';
import notifications from '../../../utilities/notifications';
import url from '../../../utilities/url'
import Select from '../../../components/Select'
import Input from '../../../components/Input'
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

console.error = jest.fn();

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {
            //
        })
    }
});

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {
            //
        }
    }
});

jest.mock('../../../utilities/url', () => {
    return {
        resolve: function() {
            //
        }
    }
});

jest.mock('../../../utilities/api-clients/recipes', () => (
    {
        getAll: jest.fn(() => {
            return Promise.resolve({
              //
            })
        })
    }
));

jest.mock('../../../utilities/api-clients/datasets', () => (
    {
        get: jest.fn(() => {
            return Promise.resolve({
                next: {}
            });
        }),
        getVersion: jest.fn(() => {
            return Promise.resolve({
            })
        }),
        getInstance: jest.fn(() => {
            return Promise.resolve({
            })
        })
    }
));

const mockEvent = {
    preventDefault: function() {}
}

const exampleDataset = {
    current: {
        title: 'CPI',
    }
}

const exampleInstance = {
    edition: "1",
    dimensions: [
      {
        name:"time"
      },
      {
        name:"geography"
      },
      {
        name:"aggregate"
      }
    ]
}

const exampleRecipe = {
  output_instances: [{
    editions: ["Time-series"],
    dataset_id: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
  }]
}

const defaultProps = {
    dispatch: function(){},
    dataset: {...exampleDataset.current},
    params: {
        datasetID: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68",
        instanceID: "1234"
    },
    instance: {...exampleInstance},
    recipes:{...exampleRecipe}
}

test("Version metadata page matches stored snapshot", () => {
    const component = renderer.create(
      <VersionMetadata {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("Dataset title updates after successful fetch from dataset API on mount", async () => {
    const component = shallow(
        <VersionMetadata {...defaultProps} />
    );

    await component.instance().componentWillMount();
    await component.update(); // update() appears to be async so we need to wait for it to finish before asserting
    expect(component.state("title")).toBe("CPI");
});


test("Edition state updates when value is changed", async () => {
    const component = shallow(
        <VersionMetadata {...defaultProps} />
    );

    expect(component.update().state("edition")).toBe("");
    component.instance().handleSelectChange({preventDefault: ()=>{}, target: {id:"edition", value: "2"}});
    expect(component.update().state("edition")).toBe("2");
});

test("Available release frequencies maps correctly to select element", () => {
    const component = shallow(
        <VersionMetadata {...defaultProps} />
    );

    const validSelectContents = [
        {
            id: "weekly",
            name: "Weekly"
        },
        {
            id: "monthly",
            name: "Monthly"
        },
        {
            id: "yearly",
            name: "Yearly"
        }
    ]

    const createdSelectContents = component.instance().mapReleaseFreqToSelectOptions();
    expect(createdSelectContents).toEqual(expect.arrayContaining(validSelectContents));
});

test("Dimensions map to inputs correctly", async () => {
    const component = await shallow(
        <VersionMetadata {...defaultProps} />
    );
    await component.instance().componentWillMount();
    await component.update(); // update() appears to be async so we need to wait for it to finish before asserting

    component.state("dimensions").forEach((dimension, index) => {
      expect(component.find(Input).get(index).props.id).toEqual(dimension.name);
    })
});

test("Available editions maps correctly to select element", async () => {
    const component = shallow(
        <VersionMetadata {...defaultProps} />
    );
    await component.instance().componentWillMount();
    await component.update(); // update() appears to be async so we need to wait for it to finish before asserting
    const validEditions = ["Time-series"];
    const createdSelectContents = component.instance().mapEditionsToSelectOptions(component.state("editions"));

    expect(createdSelectContents).toEqual(expect.arrayContaining(validEditions));
});
