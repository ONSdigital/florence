import mockAxios from "axios";
import { getAll, create, destroy, update, show } from "../interactives-test";
const fs = require("fs");

const baseURL = "/interactives/v1";

test("Call interactives api and returns data that matches the right structure", async () => {
    jest.clearAllMocks();
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: {
                items: [
                    {
                        id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                        archive: {
                            name: "test1.zip",
                        },
                        metadata: {
                            title: "Title 1",
                            label: "Label 1",
                            internal_id: 'internal_id_1',
                            slug: "label-1",
                        },
                        published: false,
                        state: "ArchiveUploaded"
                    },
                    {
                        id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                        archive: {
                            name: "test2.zip",
                        },
                        metadata: {
                            title: "Title 2",
                            label: "Label 2",
                            internal_id: 'internal_id_2',
                            slug: "label-2",
                        },
                        published: true,
                        state: "ArchiveUploaded"
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
    expect(metadata.hasOwnProperty("label")).toEqual(true);
    expect(metadata.hasOwnProperty("internal_id")).toEqual(true);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(`${baseURL}/interactives`);
});

test("Should create an interactive and returns the right structure", async () => {
    jest.clearAllMocks();
    const testZip = fs.createReadStream(__dirname + "/../../../../files/test.zip").toString();
    const data = {
        internal_id: "internal_id",
        title: "Title",
        label: "Label",
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
                    internal_id: 'internal_id',
                    title: "Title",
                    label: "Label",
                    slug: "label",
                },
                published: true,
                state: "ArchiveUploaded"
            },
        })
    );

    const interactive = await create(formData);
    expect(interactive.hasOwnProperty("id")).toEqual(true);
    const { metadata } = interactive;
    expect(metadata.hasOwnProperty("internal_id")).toEqual(true);
    expect(metadata.internal_id).toEqual(data.internal_id);
    expect(metadata.hasOwnProperty("title")).toEqual(true);
    expect(metadata.title).toEqual(data.title);
    expect(metadata.hasOwnProperty("label")).toEqual(true);
    expect(metadata.label).toEqual(data.label);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);
    expect(metadata.slug).toEqual(data.label.toLowerCase());
    expect(interactive.hasOwnProperty("published")).toEqual(true);
    expect(interactive.hasOwnProperty("state")).toEqual(true);

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
                    internal_id: 'internal_id',
                    title: "Title",
                    label: "Label",
                    slug: "label",
                },
                published: false,
            },
        })
    );

    const interactive = await show("65a93ed2-31a1-4bd5-89dd-9d44b8cda05b");
    expect(interactive.hasOwnProperty("id")).toEqual(true);
    const { metadata } = interactive;
    expect(metadata.hasOwnProperty("title")).toEqual(true);
    expect(metadata.hasOwnProperty("label")).toEqual(true);
    expect(metadata.hasOwnProperty("internal_id")).toEqual(true);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);

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
            internal_id: 'internal_id',
            title: "Title",
            label: "Label",
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
                    internal_id: 'internal_id',
                    title: "Title",
                    label: "Label",
                    slug: "label",
                },
                published: false,
                state: "ArchiveUploaded"
            },
        })
    );

    const interactive = await update("65a93ed2-31a1-4bd5-89dd-9d44b8cda05b", formData);
    expect(interactive.hasOwnProperty("id")).toEqual(true);
    const { metadata } = interactive;
    expect(metadata.hasOwnProperty("internal_id")).toEqual(true);
    expect(metadata.internal_id).toEqual(data.metadata.internal_id);
    expect(metadata.hasOwnProperty("title")).toEqual(true);
    expect(metadata.title).toEqual(data.metadata.title);
    expect(metadata.hasOwnProperty("label")).toEqual(true);
    expect(metadata.label).toEqual(data.metadata.label);
    expect(metadata.hasOwnProperty("slug")).toEqual(true);
    expect(metadata.slug).toEqual(data.metadata.label.toLowerCase());
    expect(interactive.hasOwnProperty("published")).toEqual(true);
    expect(interactive.hasOwnProperty("state")).toEqual(true);

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
