import mockAxios from "axios";
import { getAll, create, destroy, update, show } from "../interactives-test";
const fs = require("fs");

const baseURL = "http://localhost:8081/interactives/v1";

test("Call interactives api and returns data that matches the right structure", async () => {
    jest.clearAllMocks();
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: {
                items: [
                    {
                        id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                        archive: {
                            name: "test.zip",
                        },
                        metadata: {
                            title: "Title",
                            primary_topic: "businessindustryandtrade-constructionindustry",
                            topics: null,
                            surveys: null,
                            release_date: "0001-01-01T00:00:00Z",
                            uri: "https://www.figma.com",
                            slug: "",
                            edition: "exercitation aute consectetur irure",
                            meta_description: "ullamco incididunt eu",
                        },
                        published: false,
                    },
                    {
                        id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                        archive: {
                            name: "test1.zip",
                        },
                        metadata: {
                            title: "Title 1",
                            primary_topic: "businessindustryandtrade-constructionindustry",
                            topics: null,
                            surveys: null,
                            release_date: "0001-01-01T00:00:00Z",
                            uri: "https://www.test.com",
                            slug: "",
                            edition: "exercitation aute consectetur irure",
                            meta_description: "ullamco incididunt eu",
                        },
                        published: false,
                    },
                ],
                count: 1,
                offset: 0,
                limit: 20,
                total_count: 2,
            },
        })
    );

    const interactives = await getAll();
    const firstObject = interactives.items[0];
    expect(firstObject.hasOwnProperty("id")).toEqual(true);
    const { metadata } = firstObject;
    expect(metadata.hasOwnProperty("title")).toEqual(true);
    expect(metadata.hasOwnProperty("primary_topic")).toEqual(true);
    expect(metadata.hasOwnProperty("topics")).toEqual(true);
    expect(metadata.hasOwnProperty("surveys")).toEqual(true);
    expect(metadata.hasOwnProperty("release_date")).toEqual(true);
    expect(metadata.hasOwnProperty("uri")).toEqual(true);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);
    expect(metadata.hasOwnProperty("edition")).toEqual(true);
    expect(metadata.hasOwnProperty("meta_description")).toEqual(true);

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(`${baseURL}/interactives`);
});

test("Should create an interactive and returns the right structure", async () => {
    jest.clearAllMocks();
    const testZip = fs.createReadStream(__dirname + "/../../../../files/test.zip").toString();
    const data = {
        title: "Title proon",
        primary_topic: "businessindustryandtrade-constructionindustry",
        topics: null,
        surveys: null,
        release_date: "0001-01-01T00:00:00Z",
        uri: "https://www.figma.com",
        slug: "",
        edition: "exercitation aute consectetur irure",
        meta_description: "ullamco incididunt eu",
    };

    const formData = new FormData();
    formData.append("file", testZip);
    formData.append("update", JSON.stringify(data));

    mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
            data: {
                id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                archive: {
                    name: "test.zip",
                },
                metadata: {
                    title: "Title proon",
                    primary_topic: "businessindustryandtrade-constructionindustry",
                    topics: null,
                    surveys: null,
                    release_date: "0001-01-01T00:00:00Z",
                    uri: "https://www.figma.com",
                    slug: "",
                    edition: "exercitation aute consectetur irure",
                    meta_description: "ullamco incididunt eu",
                },
                published: false,
            },
        })
    );

    const interactive = await create(formData);
    expect(interactive.hasOwnProperty("id")).toEqual(true);
    const { metadata } = interactive;
    expect(metadata.hasOwnProperty("title")).toEqual(true);
    expect(metadata.title).toEqual(data.title);
    expect(metadata.hasOwnProperty("primary_topic")).toEqual(true);
    expect(metadata.primary_topic).toEqual(data.primary_topic);
    expect(metadata.hasOwnProperty("topics")).toEqual(true);
    expect(metadata.hasOwnProperty("surveys")).toEqual(true);
    expect(metadata.hasOwnProperty("release_date")).toEqual(true);
    expect(metadata.hasOwnProperty("uri")).toEqual(true);
    expect(metadata.uri).toEqual(data.uri);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);
    expect(metadata.hasOwnProperty("edition")).toEqual(true);
    expect(metadata.hasOwnProperty("meta_description")).toEqual(true);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(`${baseURL}/interactives`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
});

test("Should get an interactive", async () => {
    jest.clearAllMocks();
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: {
                id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                archive: {
                    name: "test.zip",
                },
                metadata: {
                    title: "Title proon",
                    primary_topic: "businessindustryandtrade-constructionindustry",
                    topics: null,
                    surveys: null,
                    release_date: "0001-01-01T00:00:00Z",
                    uri: "https://www.figma.com",
                    slug: "",
                    edition: "exercitation aute consectetur irure",
                    meta_description: "ullamco incididunt eu",
                },
                published: false,
            },
        })
    );

    const interactive = await show("65a93ed2-31a1-4bd5-89dd-9d44b8cda05b");
    expect(interactive.hasOwnProperty("id")).toEqual(true);
    const { metadata } = interactive;
    expect(metadata.hasOwnProperty("title")).toEqual(true);
    expect(metadata.hasOwnProperty("primary_topic")).toEqual(true);
    expect(metadata.hasOwnProperty("topics")).toEqual(true);
    expect(metadata.hasOwnProperty("surveys")).toEqual(true);
    expect(metadata.hasOwnProperty("release_date")).toEqual(true);
    expect(metadata.hasOwnProperty("uri")).toEqual(true);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);
    expect(metadata.hasOwnProperty("edition")).toEqual(true);
    expect(metadata.hasOwnProperty("meta_description")).toEqual(true);

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(`${baseURL}/interactives/65a93ed2-31a1-4bd5-89dd-9d44b8cda05b`);
});

test("Should update an interactive", async () => {
    jest.clearAllMocks();
    const testZip = fs.createReadStream(__dirname + "/../../../../files/test.zip").toString();
    const data = {
        id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
        archive: {
            name: "test.zip",
        },
        metadata: {
            title: "Title proon",
            primary_topic: "businessindustryandtrade-constructionindustry",
            topics: null,
            surveys: null,
            release_date: "0001-01-01T00:00:00Z",
            uri: "https://www.figma.com",
            slug: "",
            edition: "exercitation aute consectetur irure",
            meta_description: "ullamco incididunt eu",
        },
        published: false,
    };

    const formData = new FormData();
    formData.append("file", testZip);
    formData.append("update", JSON.stringify(data));

    mockAxios.put.mockImplementationOnce(() =>
        Promise.resolve({
            data: {
                id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                archive: {
                    name: "test.zip",
                },
                metadata: {
                    title: "Title proon",
                    primary_topic: "businessindustryandtrade-constructionindustry",
                    topics: null,
                    surveys: null,
                    release_date: "0001-01-01T00:00:00Z",
                    uri: "https://www.figma.com",
                    slug: "",
                    edition: "exercitation aute consectetur irure",
                    meta_description: "ullamco incididunt eu",
                },
                published: false,
            },
        })
    );

    const interactive = await update("65a93ed2-31a1-4bd5-89dd-9d44b8cda05b", formData);
    expect(interactive.hasOwnProperty("id")).toEqual(true);
    const { metadata } = interactive;
    expect(metadata.hasOwnProperty("title")).toEqual(true);
    expect(metadata.hasOwnProperty("primary_topic")).toEqual(true);
    expect(metadata.hasOwnProperty("topics")).toEqual(true);
    expect(metadata.hasOwnProperty("surveys")).toEqual(true);
    expect(metadata.hasOwnProperty("release_date")).toEqual(true);
    expect(metadata.hasOwnProperty("uri")).toEqual(true);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);
    expect(metadata.hasOwnProperty("edition")).toEqual(true);
    expect(metadata.hasOwnProperty("meta_description")).toEqual(true);

    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put).toHaveBeenCalledWith(`${baseURL}/interactives/65a93ed2-31a1-4bd5-89dd-9d44b8cda05b`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
});

test("Should delete an interactive", async () => {
    jest.clearAllMocks();
    mockAxios.delete.mockImplementationOnce(() =>
        Promise.resolve({
            data: {},
        })
    );

    const interactive = await destroy("65a93ed2-31a1-4bd5-89dd-9d44b8cda05b");
    expect(interactive.hasOwnProperty("id")).toEqual(false);

    expect(mockAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(`${baseURL}/interactives/65a93ed2-31a1-4bd5-89dd-9d44b8cda05b`);
});
