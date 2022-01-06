import React from "react";
import { mount } from "enzyme";
import CreateTeam from "./CreateTeam";
import { WrapperComponent } from "../../../../tests/test-utils";
import renderer from "react-test-renderer";

let dispatchedActions = [];
const mockDispatch = event => {
    dispatchedActions.push(event);
};

const mockedAllUsers = {
    count: 45,
    users: [
        {
            forename: "Test",
            lastname: "user",
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
    ],
};
// TODO can I delete this
// jest.mock("../../../utilities/api-clients/user", () => {
//     return {
//         getAll: jest.fn(() => {
//             return Promise.resolve(mockedAllUsers);
//         }),
//     };
// });
describe("CreateTeam", () => {
    const defaultBaseProps = {
        dispatch: mockDispatch,
        router: {
            listenBefore: () => {},
            setRouteLeaveHook: () => {},
        },
    };
    describe("Given valid props on initial load", () => {
        const component = mount(
            <WrapperComponent>
                <CreateTeam {...defaultBaseProps} />
            </WrapperComponent>
        );
        it("renders the relevant components to screen", () => {
            expect(component.find("Connect(CreateTeam)")).toHaveLength(1);
            expect(component.find("h1").text()).toBe("Create a preview team");
            expect(component.find("input#team-name-id").length).toBe(1);
            expect(component.find('[data-testid="dynamic-list-title"]').length).toBe(1);
            expect(component.find("content-action-bar__warn__text").length).toBe(0);
        });
        it("matches snapshot", () => {
            const componentForSnapshot = renderer.create(
                <WrapperComponent>
                    <CreateTeam {...defaultBaseProps} />
                </WrapperComponent>
            );
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
    });
});
