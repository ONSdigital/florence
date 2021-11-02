// import React, { Component } from "react";
// // import { Collections, mapStateToProps } from "../collections/";
// import Collections from "./Collections";
// import { mount, shallow } from "enzyme";
// import { EMPTY_ACTIVE_COLLECTION, DELETE_COLLECTION } from "../../config/collections/actions";
// import collectionMapper from "./mapper/collectionMapper";
// import mockedAllCollections from "../../../tests/_mock/collections.json";

// console.error = () => {};

// jest.mock("../../utilities/websocket", () => {
//     return {
//         send: jest.fn(() => {}),
//     };
// });

// jest.mock("../../utilities/log", () => {
//     return {
//         add: function () {},
//         eventTypes: {},
//     };
// });

// jest.mock("../../utilities/notifications", () => {
//     return {
//         add: jest.fn(() => {}),
//         remove: () => {},
//     };
// });

// jest.mock("../../utilities/api-clients/collections", () => {
//     return {
//         getAll: jest.fn(() => {
//             return Promise.resolve(mockedAllCollections);
//         }),
//         deletePage: () => {
//             return Promise.resolve();
//         },
//         approve: jest
//             .fn()
//             .mockImplementationOnce(() => {
//                 return Promise.reject({ status: 500 });
//             })
//             .mockImplementation(() => {
//                 return Promise.resolve();
//             }),
//         delete: jest
//             .fn()
//             .mockImplementationOnce(() => {
//                 return Promise.reject({ status: 500 });
//             })
//             .mockImplementation(() => {
//                 return Promise.resolve();
//             }),
//         get: () => {
//             return Promise.reject({ status: 404 });
//         },
//         removeDataset: () => {
//             return Promise.resolve();
//         },
//         removeDatasetVersion: () => {
//             return Promise.resolve();
//         },
//     };
// });

// jest.mock("./mapper/collectionMapper.js", () => ({
//     collectionResponseToState: jest.fn(collection => ({
//         id: collection.id,
//     })),
// }));

// let dispatchedActions = [];

// const defaultProps = {
//     dispatch: event => {
//         dispatchedActions.push(event);
//     },
//     rootPath: "/florence",
//     params: {},
//     user: {
//         userType: "ADMIN",
//     },
//     collections: [],
//     activeCollection: null,
//     collectionsToDelete: {},
//     routes: [{}],
//     enableDatasetImport: false,
//     enableHomepagePublishing: false,
// };

// const viewerProps = { ...defaultProps, user: { userType: "VIEWER" } };

// beforeEach(() => {
//     // Reset our record of the dispatched actions, so now to break future tests
//     dispatchedActions = [];
// });

// xdescribe("Collections", () => {
//     const component = mount(<Collections {...defaultProps} />);
//     it("fetches data for all collections", () => {
//         const getCollectionsCalls = collections.getAll.mock.calls.length;
//         // component.instance().UNSAFE_componentWillMount();
//         expect(collections.getAll.mock.calls.length).toBe(getCollectionsCalls + 1);
//     });

//     it("updates state to show it's fetching data for all collections", async () => {
//         expect(component.state("isFetchingCollections")).toBe(false);

//         // Tests that state is set correctly before asynchronous requests have finished
//         // component.instance().UNSAFE_componentWillMount();
//         expect(component.state("isFetchingCollections")).toBe(true);

//         // Tests that state is set correctly after asynchronous requests were successful
//         // await component.instance().UNSAFE_componentWillMount();
//         expect(component.state("isFetchingCollections")).toBe(false);

//         // Tests that state is set correctly when asynchronous requests failed
//         collections.getAll.mockImplementationOnce(() => Promise.reject({ status: 500 }));
//         // await component.instance().UNSAFE_componentWillMount();
//         expect(component.state("isFetchingCollections")).toBe(false);
//     });

//     it("excludes adding collections to state that are in the publish queue or published", async () => {
//         // Verify that the collection we expect to be excluded will be returned on mount
//         // otherwise this test could give a false positive
//         expect(mockedAllCollections.some(collection => collection.id === "test-sau39393uyqha8aw8y3n3")).toBe(true);

//         // await component.instance().UNSAFE_componentWillMount();
//         expect(dispatchedActions[0].collections.length).toBe(mockedAllCollections.length - 1);
//         expect(dispatchedActions[0].collections.some(collection => collection.id === "test-sau39393uyqha8aw8y3n3")).toBe(false);
//     });
//     describe("On unmount of the collections screen", () => {
//         it("removes the active collection from state, if it has one", () => {
//             component.setProps({
//                 activeCollection: {
//                     id: "test-collection-12345",
//                     name: "Test collection",
//                 },
//             });
//             component.instance().componentWillUnmount();
//             expect(dispatchedActions[0].type).toBe(EMPTY_ACTIVE_COLLECTION);
//         });

//         it("doesn't attempt to remove the active collection from state if one isn't set", () => {
//             component.setProps({ activeCollection: null });
//             component.instance().componentWillUnmount();
//             expect(dispatchedActions).toEqual([]);
//         });
//     });

//     describe("Selecting a collection", () => {
//         it("routes to the collection's URL", () => {
//             // component.instance().handleCollectionSelection({ id: "testcollection-12345" });
//             expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
//             expect(dispatchedActions[0].payload.method).toBe("push");
//             expect(dispatchedActions[0].payload.args[0]).toBe("/florence/collections/testcollection-12345");
//         });
//     });

//     describe("On creation of a collection", () => {
//         const createdCollection = {
//             approvalStatus: "NOT_STARTED",
//             events: [{}],
//             id: "anewtestcollection-12345",
//             name: "A new test collection",
//             publishComplete: false,
//             teams: [],
//             timeseriesImportFiles: [],
//             type: "manual",
//         };

//         it("adds the new collection to the list of all collections in state", () => {
//             component.instance().handleCollectionCreateSuccess(createdCollection);
//             const action = dispatchedActions[0];
//             expect(action.type).toBe(ADD_ALL_COLLECTIONS);
//             expect(action.collections.some(collection => collection.id === "anewtestcollection-12345")).toBe(true);
//         });

//         it("maps the new collection to the structure expected for adding to state", () => {
//             const mapperCalls = collectionMapper.collectionResponseToState.mock.calls.length;
//             component.instance().handleCollectionCreateSuccess(createdCollection);

//             expect(dispatchedActions[0].type).toBe(ADD_ALL_COLLECTIONS);
//             expect(collectionMapper.collectionResponseToState.mock.calls.length).toBe(mapperCalls + 1);
//         });

//         it("routes to the URL of the new collection", () => {
//             component.instance().handleCollectionCreateSuccess(createdCollection);
//             expect(dispatchedActions[1].type).toBe("@@router/CALL_HISTORY_METHOD");
//             expect(dispatchedActions[1].payload.method).toBe("push");
//             expect(dispatchedActions[1].payload.args[0]).toBe("/florence/collections/anewtestcollection-12345");
//         });
//     });

//     describe("Marking a collection to be deleted from list of collections", () => {
//         it("removes the collection from state", () => {
//             component.setProps({
//                 collectionsToDelete: { "test-collection-12345": null },
//             });
//             expect(dispatchedActions[0].type).toBe(DELETE_COLLECTION);
//             expect(dispatchedActions[0].collectionID).toBe("test-collection-12345");
//         });

//         it("doesn't remove the collection if all collections are still being fetched", () => {
//             component.instance().UNSAFE_componentWillMount();
//             expect(component.state("isFetchingCollections")).toBe(true);
//             component.setProps({
//                 collectionsToDelete: { "test-collection-12345": null },
//             });
//             expect(dispatchedActions).toMatchObject([]);
//         });
//     });

//     xdescribe("mapStateToProps function", () => {
//         const state = {
//             user: { userType: "ADMIN" },
//             state: {
//                 collections: {
//                     all: [{ id: "an-example-collection-12345" }, { id: "deleted-example-collection-12345" }],
//                     active: { id: "an-example-collection-12345" },
//                     toDelete: { "deleted-example-collection-12345": null },
//                 },
//                 rootPath: "/florence",
//                 config: {
//                     enableDatasetImport: false,
//                     enableHomepagePublishing: false,
//                 },
//             },
//         };

//         const mappedProps = mapStateToProps(state);

//         xit("returns the 'user' object", () => {
//             expect(mappedProps.user).toMatchObject({
//                 userType: "ADMIN",
//             });
//         });

//         xit("returns the list of collections", () => {
//             expect(mappedProps.collections).toMatchObject([{ id: "an-example-collection-12345" }, { id: "deleted-example-collection-12345" }]);
//         });

//         xit("returns the active collection", () => {
//             expect(mappedProps.activeCollection).toMatchObject({ id: "an-example-collection-12345" });
//         });

//         xit("returns the map of collection to be deleted", () => {
//             expect(mappedProps.collectionsToDelete).toMatchObject({ "deleted-example-collection-12345": null });
//         });

//         xit("returns the application's root path", () => {
//             expect(mappedProps.rootPath).toBe("/florence");
//         });
//     });

//     xtest("Viewer user types are able to see all collections, even completed", async () => {
//         const viewerComponent = shallow(<Collections {...viewerProps} />);
//         await viewerComponent.instance().fetchCollections();
//         expect(dispatchedActions[0].collections.length).toBe(mockedAllCollections.length);
//         expect(dispatchedActions[0].collections.some(collection => collection.id === "test-sau39393uyqha8aw8y3n3")).toBe(true);
//     });
// });
