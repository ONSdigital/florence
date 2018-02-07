import React, { Component } from 'react';
import { RestoreContent } from './RestoreContent';
import { shallow } from 'enzyme';
import notifications from '../../../utilities/notifications';

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {},
        eventTypes: {}
    }
});

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {}
    }
});

const mockAllDeletedContent = [
    {
        collectionId: "testdeletes1",
        collectionName: "Test deletes 1",
        deletedFiles: [{}, {}],
        eventDate:"Tue, 16 Jan 2018 15:50:19 GMT",
        id: 1,
        pageTitle: "Deleted page 1",
        type: "static_page",
        uri: "/test/deletes/1"
    }, {
        collectionId: "testdeletes2",
        collectionName: "Test deletes 2",
        deletedFiles: [{}, {}],
        eventDate:"Tue, 16 Jan 2018 15:50:19 GMT",
        id: 2,
        pageTitle: "Deleted page 2",
        type: "static_page",
        uri: "/test/deletes/2"
    }, {
        collectionId: "testdeletes3",
        collectionName: "Test deletes 3",
        deletedFiles: [{}, {}],
        eventDate:"Tue, 16 Jan 2018 15:50:19 GMT",
        id: 3,
        pageTitle: "Deleted page 3",
        type: "static_page",
        uri: "/test/deletes/3"
    }
];

jest.mock('../../../utilities/api-clients/content', () => {
    return {
        getAllDeleted: () => {
            return Promise.resolve(mockAllDeletedContent);
        },
        restoreDeleted: () => {
            return Promise.resolve();
        },
        approve: jest.fn().mockImplementationOnce(() => {
            return Promise.reject({status: 500});
        }).mockImplementation(() => {
            return Promise.resolve()
        }),
        delete: jest.fn().mockImplementationOnce(() => {
            return Promise.reject({status: 500})
        }).mockImplementation(() => {
            return Promise.resolve()
        }),
        get: () => {
            return Promise.reject({status: 404});
        }
    }
});

const defaultProps = {
    activeCollection: {},
    onClose: () => {},
    onSuccess: jest.fn()
};

const mockClickedItem = {
    id: "1",
    uri: "/test/deletes/1",
    title: "Deleted page 1",
    type: "static_page"
}

const mockSearchTerm = {
    target: {
        value: "2"
    }
};

test("Map deleted content item to state", () => {
    const expectedMappedDeletedContent = {
        id: "1",
        pageTitle: "Deleted page 1",
        columnValues: [
            <span key="1-col-val-1">{"Deleted page 1"}<br/>{"/test/deletes/1"}</span>,
            "2",
            "Tue, 16 Jan 2018 15:50:19 GMT"
        ],
        returnValue: {id: "1", uri: "/test/deletes/1", title: "Deleted page 1", type: "static_page"},
    };

    const component = shallow(
        <RestoreContent {...defaultProps} />
    );

    const mappedDeletedContent = component.instance().mapDeletedContentToState(mockAllDeletedContent[0]);
    expect(mappedDeletedContent).toMatchObject(expectedMappedDeletedContent);
});

test("Handle item click updates state correctly", () => {
    const component = shallow(
        <RestoreContent {...defaultProps} />
    );

    expect(component.update().state().activeItem).toEqual({});
    component.instance().handleItemClick(mockClickedItem);
    expect(component.update().state().activeItem).toMatchObject({
        id: "1",
        uri: "/test/deletes/1",
        title: "Deleted page 1",
        type: "static_page"
    });
});

describe("Searching for deleted content", () => {
    const component = shallow(
        <RestoreContent {...defaultProps} />
    );

    it("correct results are added to state", () => {
        const expectedFilteredDeletedContent = {
            columnValues: [
                <span key="2-col-val-1">Deleted page 2<br />/test/deletes/2</span>,
                "2",
                "Tue, 16 Jan 2018 15:50:19 GMT"
            ],
            id: "2",
            pageTitle: "Deleted page 2",
            returnValue: {"id": "2", "title": "Deleted page 2", "type": "static_page", "uri": "/test/deletes/2"}
        };
        component.instance().handleSearch(mockSearchTerm);
        expect(component.update().state().filteredDeletedContent).toContainEqual(expectedFilteredDeletedContent)
    });

    it("active item is cleared from state", () => {
        component.setState({activeItem: mockClickedItem});
        component.instance().handleSearch(mockSearchTerm);
        expect(component.update().state().activeItem).toEqual({});
    })
});

describe("When getting all deleted content", () => {
    const component = shallow(
        <RestoreContent {...defaultProps} />
    );

    it("a loading icon is shown", () => {
        component.instance().getAllDeletedContent();
        expect(component.state('isGettingDeletedContent')).toBe(true);
    });

    it("the loading icon is hidden on success", async () => {
        await component.instance().getAllDeletedContent();
        await component.update();
        expect(component.state('isGettingDeletedContent')).toBe(false);
    });

    it("state is updated with correct deletes on success", async () => {
        await component.instance().getAllDeletedContent();
        await component.update();
        expect(component.state('allDeletedContent').length).toEqual(mockAllDeletedContent.length);
    });
});

describe("When posting selected content to restore", () => {
    const component = shallow(
        <RestoreContent {...defaultProps} />
    );

    it("a loading icon is shown and submit button is disabled", () => {
        component.instance().handleDoneClick();
        expect(component.state('isRestoringDeletingContent')).toBe(true);
    });

    it("the loading icon is hidden on success", async () => {
        await component.instance().handleDoneClick();
        await component.update();
        expect(component.state('isRestoringDeletingContent')).toBe(false);
    });

    it("onSuccess is called after successful post", async () => {
        await component.instance().handleDoneClick();
        await component.update();
        expect(defaultProps.onSuccess).toHaveBeenCalled();
    });

});