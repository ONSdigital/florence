import React from "react";
import { HookWrapper } from "../utilities/tests/test-utils";
import { shallow } from "enzyme";
import { collections } from "../utilities/tests/mockData";
import { useSort } from "./useSort";

describe("useSort", () => {
    it("should return empty array", () => {
        let wrapper = shallow(<HookWrapper hook={() => useSort([], {})} />);

        let { hook } = wrapper.find("div").props();
        let { sortedItems } = hook;

        expect(sortedItems).toEqual([]);
    });

    it("should sort array ASC by name property", () => {
        const config = { key: "name", direction: "ASC" };
        let wrapper = shallow(<HookWrapper hook={() => useSort(collections, config)} />);
        expect(collections[0].name).toEqual("Zebedee collection");
        expect(collections[1].name).toEqual("Boo");
        expect(collections[2].name).toEqual("Test collection");
        expect(collections[3].name).toEqual("Different collection");
        expect(collections[4].name).toEqual("Ala collection");

        let { hook } = wrapper.find("div").props();
        let { sortedItems } = hook;

        expect(sortedItems[0].name).toEqual("Ala collection");
        expect(sortedItems[1].name).toEqual("Boo");
        expect(sortedItems[2].name).toEqual("Different collection");
        expect(sortedItems[3].name).toEqual("Test collection");
        expect(sortedItems[4].name).toEqual("Zebedee collection");
    });

    it("should sort array DESC by name property", () => {
        const config = { key: "name", direction: "DESC" };
        let wrapper = shallow(<HookWrapper hook={() => useSort(collections, config)} />);
        expect(collections[0].name).toEqual("Zebedee collection");
        expect(collections[1].name).toEqual("Boo");
        expect(collections[2].name).toEqual("Test collection");
        expect(collections[3].name).toEqual("Different collection");
        expect(collections[4].name).toEqual("Ala collection");

        let { hook } = wrapper.find("div").props();
        let { sortedItems } = hook;

        expect(sortedItems[0].name).toEqual("Zebedee collection");
        expect(sortedItems[1].name).toEqual("Test collection");
        expect(sortedItems[2].name).toEqual("Different collection");
        expect(sortedItems[3].name).toEqual("Boo");
        expect(sortedItems[4].name).toEqual("Ala collection");
    });

    it("should sort array ASC by publishDate property", () => {
        const config = { key: "publishDate", direction: "ASC" };
        let wrapper = shallow(<HookWrapper hook={() => useSort(collections, config)} />);
        expect(collections[0].publishDate).toBeFalsy(); // manual collection
        expect(collections[1].publishDate).toEqual("2021-11-17T09:30:00.000Z");
        expect(collections[2].publishDate).toEqual("2022-01-01T00:30:00.000Z");
        expect(collections[3].publishDate).toBeFalsy();
        expect(collections[4].publishDate).toEqual("2021-12-17T09:30:00.000Z");

        let { hook } = wrapper.find("div").props();
        let { sortedItems} = hook;

        expect(sortedItems[0].publishDate).toEqual("2021-11-17T09:30:00.000Z");
        expect(sortedItems[1].publishDate).toEqual("2021-12-17T09:30:00.000Z");
        expect(sortedItems[2].publishDate).toEqual("2022-01-01T00:30:00.000Z");
        expect(sortedItems[3].publishDate).toBeFalsy();
        expect(sortedItems[4].publishDate).toBeFalsy();
    });

    it("should sort array DESC by publishDate property non date placing at the bottom", () => {
        const config = { key: "publishDate", direction: "DESC" };
        let wrapper = shallow(<HookWrapper hook={() => useSort(collections, config)} />);
        expect(collections[0].publishDate).toBeFalsy(); // manual collection
        expect(collections[1].publishDate).toEqual("2021-11-17T09:30:00.000Z");
        expect(collections[2].publishDate).toEqual("2022-01-01T00:30:00.000Z");
        expect(collections[3].publishDate).toBeFalsy();
        expect(collections[4].publishDate).toEqual("2021-12-17T09:30:00.000Z");

        let { hook } = wrapper.find("div").props();
        let { sortedItems} = hook;
        expect(sortedItems[0].publishDate).toEqual("2022-01-01T00:30:00.000Z");
        expect(sortedItems[1].publishDate).toEqual("2021-12-17T09:30:00.000Z");
        expect(sortedItems[2].publishDate).toEqual("2021-11-17T09:30:00.000Z");
        expect(sortedItems[3].publishDate).toBeFalsy();
        expect(sortedItems[4].publishDate).toBeFalsy();
    });
});
