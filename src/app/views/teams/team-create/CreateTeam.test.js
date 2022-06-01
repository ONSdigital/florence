import React from "react";
import { mount } from "enzyme";
import CreateTeam from "./CreateTeam";
import { WrapperComponent } from "../../../utilities/tests/test-utils";
import renderer from "react-test-renderer";

let dispatchedActions,
    mockedNotifications = [];
const mockDispatch = event => {
    dispatchedActions.push(event);
};

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(event => {
            mockedNotifications.push(event);
        }),
    };
});

const allPreviewUsers = [
    {
        forename: "Test",
        lastname: "this",
        email: "test@test.com",
        groups: [],
        status: "CONFIRMED",
        active: true,
        id: "aaa-bbb-ccc",
        status_notes: "",
    },
    {
        forename: "Test",
        lastname: "user 2",
        email: "test2@test.com",
        groups: [],
        status: "CONFIRMED",
        active: true,
        id: "ddd-eee-fff",
        status_notes: "",
    },
    {
        forename: "Test",
        lastname: "user 3",
        email: "test3@test.com",
        groups: [],
        status: "CONFIRMED",
        active: true,
        id: "ggg-hhh-iii",
        status_notes: "",
    },
];

describe("CreateTeam", () => {
    beforeEach(() => {
        dispatchedActions = [];
    });
    const props = {
        dispatch: mockDispatch,
        router: {
            listenBefore: () => {},
            setRouteLeaveHook: () => {},
        },
        allPreviewUsers,
    };
    describe("Given valid props on initial load", () => {
        const component = mount(
            <WrapperComponent>
                <CreateTeam {...props} />
            </WrapperComponent>
        );
        it("renders the relevant components to screen", () => {
            expect(component.find("Connect(CreateTeam)")).toHaveLength(1);
            expect(component.find("h1").text()).toBe("Create a preview team");
            expect(component.find("input#team-name-id").length).toBe(1);
            expect(component.find(".dynamic-list__title").length).toBe(1);
            expect(component.find(".no-team-members").length).toBe(1);
            expect(component.find("content-action-bar__warn__text").length).toBe(0);
        });
        describe("Given user attempts to create team with no users or name", () => {
            component.find("button#create-team-btn").simulate("click");
            it("notifies the user this is an unacceptable action", () => {
                expect(mockedNotifications.length).toBeGreaterThanOrEqual(1);
            });
        });

        it("matches snapshot", () => {
            const componentForSnapshot = renderer.create(
                <WrapperComponent>
                    <CreateTeam {...props} />
                </WrapperComponent>
            );
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
    });
});
