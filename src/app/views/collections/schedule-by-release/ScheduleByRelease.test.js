import React from 'react';
import ScheduleByRelease from './ScheduleByRelease';
import { shallow } from 'enzyme';
import releases from '../../../utilities/api-clients/releases';

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {},
        eventTypes: {}
    }
});

jest.mock('../../../utilities/date', () => ({
    format: () => "a formatted date"
}));

jest.mock('../../../utilities/api-clients/releases', () => ({
    getUpcoming: jest.fn(() => {
        return Promise.resolve({
            result: {
                results: [
                    {
                        uri: "/releases/my-release",
                        description: {
                            title: "My release",
                            releaseDate: "2018-05-17T09:30:54.928Z",
                            finalised: true
                        }
                    },
                    {
                        uri: "/releases/my-second-release",
                        description: {
                            title: "My second release",
                            releaseDate: "2018-05-20T09:30:54.928Z",
                            finalised: true
                        }
                    },
                    {
                        uri: "/releases/my-third-release",
                        description: {
                            title: "My third release",
                            releaseDate: "2018-05-21T09:30:54.928Z",
                            finalised: true
                        }
                    }
                ],
                numberOfResults: 3
            }
        });
    })
}));

const props = {
    onClose: () => {},
    onSubmit: () => {}
}

const component = shallow(
    <ScheduleByRelease {...props} />
);

const mockedReleases = [
    {
        uri: "/releases/my-release",
        description: {
            title: "My release",
            releaseDate: "2018-05-17T09:30:54.928Z",
            finalised: true
        }
    },
    {
        uri: "/releases/my-second-release",
        description: {
            title: "My second release",
            releaseDate: "2018-05-20T09:30:54.928Z",
            finalised: true
        }
    },
    {
        uri: "/releases/my-third-release",
        description: {
            title: "My third release",
            releaseDate: "2018-05-21T09:30:54.928Z",
            finalised: true
        }
    }
];

describe("Mapping releases response to table", () => {

    it("matches the structure needed for the selectable box", () => {
        const expectedTableData = [
            {
                id: "/releases/my-release",
                columnValues: ["My release", "a formatted date"],
                returnValue: {
                    uri: "/releases/my-release",
                    releaseDate: "2018-05-17T09:30:54.928Z",
                    title: "My release",
                    isProvisional: false
                }
            },
            {
                id: "/releases/my-second-release",
                columnValues: ["My second release", "a formatted date"],
                returnValue: {
                    uri: "/releases/my-second-release",
                    releaseDate: "2018-05-20T09:30:54.928Z",
                    title: "My second release",
                    isProvisional: false
                }
            },
            {
                id: "/releases/my-third-release",
                columnValues: ["My third release", "a formatted date"],
                returnValue: {
                    uri: "/releases/my-third-release",
                    releaseDate: "2018-05-21T09:30:54.928Z",
                    title: "My third release",
                    isProvisional: false
                }
            }
        ];

        expect(component.instance().mapReleasesToTableRows(mockedReleases)).toEqual(expectedTableData);
    });

    it("sets the 'isProvisional' property correctly", () => {
        const releasesWithProvisional = [{
            uri: "/releases/my-release",
            description: {
                title: "My release",
                releaseDate: "2018-05-21T09:30:54.928Z",
                finalised: false
            }
        }];

        expect(component.instance().mapReleasesToTableRows(releasesWithProvisional)[0].returnValue.isProvisional).toBe(true);
    });
    
    it("excludes cancelled releases", () => {
        const releasesWithCancelled = [
            ...mockedReleases,
            {
                uri: "/releases/my-cancelled-release",
                description: {
                    title: "My cancelled release",
                    releaseDate: "2018-05-21T09:30:54.928Z",
                    finalised: false,
                    cancelled: true
                }
            }
        ]
        const mappedReleases = component.instance().mapReleasesToTableRows(releasesWithCancelled);

        expect(releasesWithCancelled.length).toBe(4);
        expect(mappedReleases.some(release => release.uri === "/releases/my-cancelled-release")).toBe(false);
        expect(mappedReleases.length).toBe(3);
    });
    
    it("excludes published releases", () => {
        const releasesWithPublished = [
            ...mockedReleases,
            {
                uri: "/releases/my-published-release",
                description: {
                    title: "My published release",
                    releaseDate: "2018-05-21T09:30:54.928Z",
                    finalised: false,
                    cancelled: true
                }
            }
        ]
        const mappedReleases = component.instance().mapReleasesToTableRows(releasesWithPublished);

        expect(releasesWithPublished.length).toBe(4);
        expect(mappedReleases.some(release => release.uri === "/releases/my-published-release")).toBe(false);
        expect(mappedReleases.length).toBe(3);
    });
    
    it("removes <strong> tags from results", () => {
        const releasesWithHTMLTags = [{
            uri: "/releases/my-tagged-release",
            description: {
                title: "My tagged <strong>release</strong>",
                releaseDate: "2018-05-21T09:30:54.928Z",
                finalised: true
            }
        }];

        expect(component.instance().mapReleasesToTableRows(releasesWithHTMLTags)[0].returnValue.title).toBe("My tagged release");
    });

});

describe("Searching releases", () => {

    it("updates the 'number of pages' state", async () => {
        releases.getUpcoming.mockImplementationOnce(() => Promise.resolve({
            result: {
                results: [],
                numberOfResults: 50,
                paginator: {
                    numberOfPages: 5
                }
            }
        }));
        component.setState({numberOfPages: 0});
        await component.instance().searchReleases("test query");
        expect(component.state("numberOfPages")).toBe(5);
    });

    it("defaults the 'number of pages' state to 1", async () => {
        component.setState({numberOfPages: 0});
        await component.instance().searchReleases("test query");
        expect(component.state("numberOfPages")).toBe(1);
    });
    
    it("updates the 'number of release' state", async () => {
        component.setState({numberOfReleases: 0});
        await component.instance().searchReleases("test query");
        expect(component.state("numberOfReleases")).toBe(3);
    });

    it("resets the 'current page' state to 1 on a new search", async () => {
        component.setState({currentPage: 0});
        await component.instance().searchReleases("test query");
        expect(component.state("currentPage")).toBe(1);
    });

    it("updates the state with the latest typed query", () => {
        component.setState({searchQuery: ""});
        component.instance().searchReleases("a typed query");
        expect(component.state("searchQuery")).toBe("a typed query");
    });

    it("overwrites the latest typed query in state with the latest fetched query on a successful response", async () => {
        let syncHasRun = false;
        component.setState({searchQuery: ""});

        Promise.resolve(component.instance().searchReleases("a successful query")).then(() => {
            // syncHasRun===true tells us that this is definitely resolving after the 'a typed query' has been set in state
            // which confirms that the state is being replaced on resolution of the Promise/GET of searched releases
            expect(syncHasRun).toBe(true);
            expect(component.state("searchQuery")).toBe("a successful query");
        });

        component.instance().searchReleases("a typed query");
        expect(component.state("searchQuery")).toBe("a typed query");
        syncHasRun = true; 
    });

});

describe("Loading more releases", () => {
    
    it("adds the latest data to the selectable box", async () => {
        // Update the mocked response for all of the following tests in the 'Loading more releases'
        releases.getUpcoming.mockImplementation(() => Promise.resolve({
            result: {
                results: [
                    {
                        uri: "/releases/my-fourth-release",
                        description: {
                            title: "My fourth release",
                            releaseDate: "2018-05-17T09:30:54.928Z",
                            finalised: true
                        }
                    },
                    {
                        uri: "/releases/my-fifth-release",
                        description: {
                            title: "My fifth release",
                            releaseDate: "2018-05-17T09:30:54.928Z",
                            finalised: true
                        }
                    },
                    {
                        uri: "/releases/my-sixth-release",
                        description: {
                            title: "My sixth release",
                            releaseDate: "2018-05-17T09:30:54.928Z",
                            finalised: true
                        }
                    }
                ],
                numberOfResults: 6,
                paginator: {
                    numberOfPages: 2
                }
            }
        }));

        await component.instance().loadMoreReleases();
        const newTableData = component.state('tableData');
        expect(newTableData.length).toBe(6);
        
        // Tests that the table data is mapped correctly and in the right order
        expect(newTableData[0].id).toBe("/releases/my-release");
        expect(newTableData[1].id).toBe("/releases/my-second-release");
        expect(newTableData[2].id).toBe("/releases/my-third-release");
        expect(newTableData[3].id).toBe("/releases/my-fourth-release");
        expect(newTableData[4].id).toBe("/releases/my-fifth-release");
        expect(newTableData[5].id).toBe("/releases/my-sixth-release");
    });

    it("maps data response to table structure", async () => {
        await component.instance().loadMoreReleases();
        const newTableData = component.state('tableData');
        expect(newTableData[4]).toEqual({
            id: "/releases/my-fifth-release",
            columnValues: ["My fifth release", "a formatted date"],
            returnValue: {
                uri: "/releases/my-fifth-release",
                releaseDate: "2018-05-17T09:30:54.928Z",
                title: "My fifth release",
                isProvisional: false
            }
        });
    });

    it("updates the 'current page' state to the next page number", async () => {
        component.setState({currentPage: 1});
        await component.instance().loadMoreReleases();
        expect(component.state('currentPage')).toBe(2);
    });

});