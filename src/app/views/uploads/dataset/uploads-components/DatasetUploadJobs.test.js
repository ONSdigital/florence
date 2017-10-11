import React from 'react';
import DatasetUploadJobs from './DatasetUploadJobs';
import { shallow, mount } from 'enzyme';

const jobs = [
    {
        id: "id1",
        recipe: "recipe1"
    },
    {
        id: "id2",
        recipe: "recipe2"
    },
    {
        id: "id3",
        recipe: "recipe1"
    }
]

const datasets = [
    {
        id: "recipe1",
        alias: "Dataset 1"
    },
    {
        id: "recipe2",
        alias: "Dataset 2"
    }
]

const defaultProps = {
    rootPath: "/florence",
    datasets,
    jobs

}

console.warn = jest.fn(warn => {
    throw new Error("console.warn run!")
})

test("Correct number of jobs are rendered", () => {
    const component = mount(
        <DatasetUploadJobs {...defaultProps} />
    )
    
    expect(component.find('a').length).toBe(3);
})

test("All in progress jobs are get the correct dataset alias from the recipes data", () => {
    const component = mount(
        <DatasetUploadJobs {...defaultProps} />
    )
    const items = component.find('a');
    const recipeCount = {
        1: 0,
        2: 0,
        3: 0
    }
    items.forEach(item => {
        switch (item.text()) {
            case("Dataset 1"): {
                recipeCount[1]++
                break;
            }
            case("Dataset 2"): {
                recipeCount[2]++
                break;
            }
            default: {
                recipeCount[3]++
                break;
            }
        }
    });

    expect(recipeCount[1]).toBe(2);
    expect(recipeCount[2]).toBe(1);
    expect(recipeCount[3]).toBe(0);
})

test("Attempt to render job with an unrecognised ID should show console warning", () => {
    const component = shallow(
        <DatasetUploadJobs {...defaultProps} />
    )

    expect(() => {
        component.setProps({
            jobs: [
                ...defaultProps.jobs,
                {
                    id: "id4",
                    recipe: "unknown-recipe"
                }
            ]
        })
    }).toThrow();
})