import {
    updateActiveCollection,
    markCollectionForDelete,
    deleteCollectionFromAllCollections,
    updatePagesInActiveCollection,
    updateTeamsInActiveCollection,
    emptyActiveCollection,
} from "./actions";

import reducer from "./reducer";
import { initialState } from "./reducer";

xdescribe("userReducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it("should handle a collectionsReducer action", () => {
        const previousState = {};
        expect(reducer(previousState, collectionsReducer("1", "Collection1", "status", "type", false, true, true))).toEqual({
            active: {
                id: "1",
                name: "Collection1",
                publishDate: "",
                status: "status",
                type: "type",
                isForcedManualType: false,
                canBeApproved: true,
                canBeDeleted: true,
            },
        });
    });

    xit("should handle a addAllCollections action", () => {
        const previousState = {};
        expect(reducer(previousState, addAllCollections())).toEqual({
            isAuthenticated: false,
            email: null,
            userType: null,
            isAdmin: null,
        });
    });

    it("should handle a markCollectionForDelete action", () => {
        const previousState = {};
        expect(reducer(markCollectionForDelete, userLoggedOut())).toEqual({
            isAuthenticated: false,
            email: null,
            userType: null,
            isAdmin: null,
        });
    });

    it("should handle a emptyActiveCollection action", () => {
        const previousState = {};
        expect(reducer(emptyActiveCollection, userLoggedOut())).toEqual({
            isAuthenticated: false,
            email: null,
            userType: null,
            isAdmin: null,
        });
    });

    it("should handle a deleteCollectionFromAllCollections action", () => {
        const previousState = {};
        expect(reducer(deleteCollectionFromAllCollections, userLoggedOut())).toEqual({
            isAuthenticated: false,
            email: null,
            userType: null,
            isAdmin: null,
        });
    });

    it("should handle a updatePagesInActiveCollection action", () => {
        const previousState = {};
        expect(reducer(previousState, updatePagesInActiveCollection())).toEqual({
            isAuthenticated: false,
            email: null,
            userType: null,
            isAdmin: null,
        });
    });

    it("should handle a updateTeamsInActiveCollection action", () => {
        const previousState = {};
        expect(reducer(previousState, updateTeamsInActiveCollection({}))).toEqual({
            active: { teams: {} },
        });
    });
});
