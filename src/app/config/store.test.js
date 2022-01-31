import { createStore, combineReducers } from "redux";
import reducer from "./reducer";
import userReducer from "./user/userReducer";
import * as actions from "./actions";
import * as selectors from "./selectors";
import { collections, users, notifications, teams, popouts } from "../utilities/tests/mockData";
import { initialState } from "./initialState";

describe("Store", () => {
    describe("state collections", () => {
        it("should handle loadCollectionsSuccess", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                })
            );
            expect(selectors.getCollections(store.getState().state).length).toEqual(0);

            store.dispatch(actions.loadCollectionsSuccess(collections));

            expect(selectors.getCollections(store.getState().state).length).toEqual(collections.length);
        });

        it("should handle loadCollectionsFailure", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                }),
                {
                    state: {
                        collections: {
                            all: [],
                            isLoading: true,
                        },
                    },
                }
            );
            expect(selectors.getCollectionsLoading(store.getState().state)).toEqual(true);

            store.dispatch(actions.loadCollectionsFailure());

            expect(selectors.getCollectionsLoading(store.getState().state)).toEqual(false);
        });

        it("should handle loadCollectionsProgress", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                }),
                {
                    state: {
                        collections: {
                            all: [],
                            isLoading: false,
                        },
                    },
                }
            );
            expect(selectors.getCollections(store.getState().state).length).toEqual(0);

            store.dispatch(actions.loadCollectionsProgress());

            expect(selectors.getCollectionsLoading(store.getState().state)).toEqual(true);
        });

        it("should handle creating collection", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                }),
                {
                    state: {
                        collections: {
                            all: [],
                            isLoading: false,
                        },
                    },
                }
            );
            const newCollection = { ...collections[0] };
            expect(selectors.getCollections(store.getState().state).length).toEqual(0);

            store.dispatch(actions.createCollectionSuccess(newCollection));

            expect(selectors.getCollections(store.getState().state)[0]).toEqual(newCollection);
            expect(selectors.getCollections(store.getState().state).length).toEqual(1);
        });

        it("should handle setting up active collection when new collection has been created", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                })
            );
            const newCollection = { ...collections[0] };
            expect(selectors.getCollections(store.getState().state).length).toEqual(0);
            expect(selectors.getActive(store.getState().state)).toBeNull();

            store.dispatch(actions.createCollectionSuccess(newCollection));

            expect(selectors.getActive(store.getState().state)).toEqual(newCollection);
            expect(selectors.getActive(store.getState().state)).not.toBeNull();
        });
        describe("when updating existing collection", () => {
            it("should handle set isUpdating", () => {
                const store = createStore(
                    combineReducers({
                        state: reducer,
                    }),
                    {
                        state: {
                            collections: {
                                isUpdating: false,
                            },
                        },
                    }
                );

                store.dispatch(actions.updateCollectionProgress());

                expect(selectors.getIsUpdatingCollection(store.getState().state)).toEqual(true);
            });

            it("should handle isUpdating collection to false if update action fails", () => {
                const store = createStore(
                    combineReducers({
                        state: reducer,
                    }),
                    {
                        state: {
                            collections: {
                                isUpdating: true,
                            },
                        },
                    }
                );

                expect(selectors.getIsUpdatingCollection(store.getState().state)).toEqual(true);

                store.dispatch(actions.updateCollectionFailure());

                expect(selectors.getIsUpdatingCollection(store.getState().state)).toEqual(false);
            });

            it("should handle updating collection success", () => {
                const store = createStore(
                    combineReducers({
                        state: reducer,
                    }),
                    {
                        state: {
                            collections: {
                                all: collections,
                                isUpdating: false,
                            },
                        },
                    }
                );
                const updatedCollection = {
                    ...collections[0],
                    name: "Updated Name",
                };

                expect(selectors.getIsUpdatingCollection(store.getState().state)).toEqual(false);
                expect(selectors.getCollections(store.getState().state).filter(collection => collection.id === updatedCollection.id)[0].name).toEqual(
                    "Zebedee collection"
                );

                store.dispatch(actions.updateCollectionSuccess(updatedCollection));

                const collectionsState = selectors.getCollections(store.getState().state);

                expect(selectors.getIsUpdatingCollection(store.getState().state)).toEqual(false);
                expect(collectionsState.length).toEqual(collections.length);
                expect(collectionsState[0]).toEqual(updatedCollection);
                expect(selectors.getCollections(store.getState().state).filter(collection => collection.id === updatedCollection.id)[0].name).toEqual(
                    "Updated Name"
                );
            });
        });

        it("should handle deleting collection and removing active collection", () => {
            const collectionID = collections[0].id;
            const activeCollection = collections[0];
            const store = createStore(
                combineReducers({
                    state: reducer,
                }),
                {
                    state: {
                        collections: {
                            all: collections,
                            active: activeCollection,
                        },
                    },
                }
            );
            expect(selectors.getActive(store.getState().state)).toEqual(activeCollection);

            store.dispatch(actions.deleteCollection(collectionID));

            expect(selectors.getCollections(store.getState().state).length).toEqual(collections.length - 1);
            expect(selectors.getCollections(store.getState().state)).not.toContain(collections[0]);
            expect(selectors.getActive(store.getState().state)).toBeNull();
        });
        it("should handle filtering collections for empty string", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                }),
                {
                    state: {
                        collections: {
                            all: collections,
                        },
                        search: "",
                    },
                }
            );

            expect(selectors.getFilteredCollections(store.getState().state).length).toEqual(collections.length);
        });
        it("should handle filtering collections for valid phrase", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                }),
                {
                    state: {
                        collections: {
                            all: collections,
                        },
                        search: "Boo",
                    },
                }
            );

            expect(selectors.getFilteredCollections(store.getState().state).length).toEqual(1);
            expect(selectors.getFilteredCollections(store.getState().state)[0].name).toContain("Boo");
        });
    });
    describe("state config", () => {
        it("should handle setConfig", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                })
            );

            expect(store.getState().state.config.enableDatasetImport).toEqual(false);
            expect(store.getState().state.config.enableHomepagePublishing).toEqual(false);
            expect(store.getState().state.config.enableNewSignIn).toEqual(false);

            store.dispatch(actions.setConfig({ enableDatasetImport: true, enableHomepagePublishing: true, enableNewSignIn: true }));

            expect(store.getState().state.config.enableDatasetImport).toEqual(true);
            expect(store.getState().state.config.enableHomepagePublishing).toEqual(true);
            expect(store.getState().state.config.enableNewSignIn).toEqual(true);
        });
    });

    describe("state users", () => {
        it("should handle loading addAllUsers", () => {
            const store = createStore(
                combineReducers({
                    state: reducer,
                })
            );
            expect(store.getState().state.users.all).toEqual([]);

            store.dispatch(actions.addAllUsers(users));

            expect(store.getState().state.users.all).toEqual(users);
            expect(store.getState().state.users.all.length).toEqual(users.length);
        });
    });

    it("should handle reset()", () => {
        const store = createStore(
            combineReducers({
                state: reducer,
            }),
            {
                state: {
                    collections: {
                        all: collections,
                        isUpdating: false,
                        active: collections[0],
                    },
                    users: {
                        all: users,
                        active: users[0],
                    },
                    config: {
                        enableDatasetImport: true,
                        enableHomepagePublishing: true,
                        enableNewSignIn: true,
                    },
                    teams: {
                        active: {},
                        all: teams,
                        users: [],
                        isLoading: false,
                    },
                    popouts: popouts,
                    notifications: notifications,
                },
            }
        );

        expect(selectors.getCollections(store.getState().state).length).toEqual(collections.length);
        expect(selectors.getActive(store.getState().state)).toEqual(collections[0]);
        expect(store.getState().state.users.all).toEqual(users);
        expect(store.getState().state.users.all.length).toEqual(users.length);
        expect(store.getState().state.users.active).toEqual(users[0]);
        expect(selectors.getTeams(store.getState().state).length).toEqual(teams.length);
        expect(selectors.getNotifications(store.getState().state).length).toEqual(notifications.length);
        expect(store.getState().state.popouts.length).toEqual(popouts.length);
        expect(store.getState().state.config.enableDatasetImport).toEqual(true);
        expect(store.getState().state.config.enableHomepagePublishing).toEqual(true);
        expect(store.getState().state.config.enableNewSignIn).toEqual(true);

        store.dispatch(actions.reset());

        // should empty
        expect(selectors.getCollections(store.getState().state).length).toEqual(0);
        expect(selectors.getActive(store.getState().state)).toBeNull();
        expect(store.getState().state.users.active).toEqual({});
        expect(store.getState().state.users.all.length).toEqual(0);
        expect(store.getState().state.users.all.length).toEqual(0);
        // should do no changes
        expect(selectors.getNotifications(store.getState().state).length).toEqual(notifications.length);
        expect(store.getState().state.popouts.length).toEqual(2);
        expect(store.getState().state.config.enableDatasetImport).toEqual(true);
        expect(store.getState().state.config.enableHomepagePublishing).toEqual(true);
        expect(store.getState().state.config.enableNewSignIn).toEqual(true);
    });
});
