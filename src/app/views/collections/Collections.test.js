import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Collections from "./Collections";
import { createMockUser, WrapperComponent } from "../../../tests/test-utils";
import { collections, emptyCollection } from "../../../tests/mockData";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const viewer = createMockUser("viewer@test.com", true, true, "VIEWER");

describe("Collections", () => {
    const props = {
        collections: emptyCollection,
        isLoading: false,
        params: {},
        rootPath: "test",
        routes: [],
        search: "",
        user: admin,
        updateWorkingOn: () => {},
        dispatch: () => {},
        loadCollections: () => {},
    };

    describe("when collections are empty", () => {
        const wrapper = shallow(<Collections {...props} />);
        it("renders <CollectionCreateController /> component", () => {
            expect(wrapper.find("Connect(CollectionCreateController)")).toHaveLength(1);
        });

        it("renders <DoubleSelectableBox /> component with empty props", () => {
            expect(wrapper.find("DoubleSelectableBox")).toHaveLength(1);
            expect(wrapper.find("DoubleSelectableBox").props().items).toHaveLength(0);
        });

        it("renders <Search /> component", () => {
            expect(wrapper.find("Search")).toHaveLength(1);
        });

        it("renders headings", () => {
            expect(wrapper.find("h1")).toHaveLength(2);
            expect(wrapper.text().includes("Select a collection")).toBe(true);
            expect(wrapper.text().includes("Create a collection")).toBe(true);
        });
    });

    describe("when there are collections", () => {
        const collectionsProps = {
            ...props,
            collections,
        };
        const wrapper = shallow(<Collections {...collectionsProps} />);

        describe("when admin user", () => {
            it("renders <DoubleSelectableBox /> component with not completed collections", () => {
                expect(wrapper.find("DoubleSelectableBox")).toHaveLength(1);
                expect(wrapper.find("DoubleSelectableBox").props().items).toHaveLength(collections.length - 1);
            });
        });

        describe("when viewer user", () => {
            it("renders <DoubleSelectableBox /> component with all collections", () => {
                const viewerProps = {
                    ...props,
                    user: viewer,
                    collections,
                };
                const wrapper = shallow(<Collections {...viewerProps} />);
                expect(wrapper.find("DoubleSelectableBox")).toHaveLength(1);
                expect(wrapper.find("DoubleSelectableBox").props().items).toHaveLength(collections.length);
            });
        });
    });
});
