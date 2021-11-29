import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Collections from "./Collections";
import { createMockUser } from "../../../tests/test-utils";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const viewer = createMockUser("viewer@test.com", true, true, "VIEWER");
const collections = [
    {
        approvalStatus: "NOT_STARTED",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "hello",
        timeseriesImportFiles: [],
        id: "anothercollection-91bc818cff240fa546c84b0cc4c3d32f0667de3068832485e254c17655d5b4ad",
        name: "Another collection",
        type: "manual",
        teams: [],
    },
    {
        approvalStatus: "IN_PROGRESS",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c",
        name: "asdasdasd",
        type: "manual",
        teams: [],
    },
    {
        approvalStatus: "IN_PROGRESS",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "test-collection-12345",
        name: "Test collection",
        type: "manual",
        teams: ["cpi", "cpih"],
    },
    {
        approvalStatus: "ERROR",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "different-collection-12345",
        name: "Test",
        type: "manual",
        teams: ["Team 2"],
    },
    {
        approvalStatus: "COMPLETE",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "test-sau39393uyqha8aw8y3n3",
        name: "Complete collection",
        type: "manual",
        teams: ["Team 2"],
    },
];

describe("Collections", () => {
    const props = {
        params: [],
        user: admin,
        collections: [],
        isLoading: false,
        updateWorkingOn: null,
        search: "",
    };
    const wrapper = shallow(<Collections {...props} />);
    describe("when collections are empty", () => {
        it("renders <CollectionCreateController /> component", () => {
            expect(wrapper.find("Connect(CollectionCreateController)")).toHaveLength(1);
        });

        it("renders <DoubleSelectableBoxController /> component with empty props", () => {
            expect(wrapper.find("DoubleSelectableBoxController")).toHaveLength(1);
            expect(wrapper.find("DoubleSelectableBoxController").props().items).toHaveLength(0);
        });

        it("renders <Search /> component", () => {
            expect(wrapper.find("Search")).toHaveLength(1);
        });

        it("renders headings", () => {
            expect(wrapper.find("h1")).toHaveLength(2);
            expect(wrapper.text().includes("Select a collection")).toBe(true);
            expect(wrapper.text().includes("Create a collection")).toBe(true);
        });

        it("does not render <Loader /> component", () => {
            expect(wrapper.find("Loader")).toHaveLength(0);
        });
    });

    describe("when there are collections", () => {
        const collectionsProps = {
            ...props,
            collections: collections,
        };
        const wrapper = shallow(<Collections {...collectionsProps} />);

        it("does not render <Loader /> component", () => {
            expect(wrapper.find("Loader")).toHaveLength(0);
        });

        describe("when admin user", () => {
            it("renders <DoubleSelectableBoxController /> component with not completed collections", () => {
                expect(wrapper.find("DoubleSelectableBoxController")).toHaveLength(1);
                expect(wrapper.find("DoubleSelectableBoxController").props().items).toHaveLength(collections.length - 1);
            });
        })

        describe("when viewer", () => {
            const viewerProps = {
                ...props,
                user: viewer,
                collections: collections,
            };
            const wrapper = shallow(<Collections {...viewerProps} />);
            it("renders <DoubleSelectableBoxController /> component with all collections", () => {
                expect(wrapper.find("DoubleSelectableBoxController")).toHaveLength(1);
                expect(wrapper.find("DoubleSelectableBoxController").props().items).toHaveLength(collections.length);
            });
        })
    });

    describe("when loading collections", () => {
        const newProps = {
            ...props,
            isLoading: true,
        };
        const wrapper = shallow(<Collections {...newProps} />);
        it("renders loader", () => {
            expect(wrapper.find("Loader")).toHaveLength(1);
        });
    });
});
