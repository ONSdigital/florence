import React from "react";
import InteractiveCreate from "./TeamCreate";
import { mount, shallow } from "enzyme";

jest.mock("../../../utilities/notifications.js", () => {
    return {
        add: function (notification) {
            mockNotifications.push(notification);
        },
    };
});

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: jest.fn().mockImplementation(() => {
            // do nothing
        }),
        data: jest.fn().mockImplementation(() => {
            // do nothing
        }),
        error: jest.fn().mockImplementation(() => {
            // do nothing
        }),
    };
});

jest.mock("../../../utilities/api-clients/teams.js", () => ({
    remove: jest.fn(() => {
        return Promise.resolve();
    }),
    add: jest
        .fn(() => {
            return Promise.reject({ status: 500 });
        })
        .mockImplementationOnce(() => {
            return Promise.reject({ status: 403 });
        })
        .mockImplementationOnce(() => {
            return Promise.reject({ status: 409 });
        }),
}));

const mockNotifications = [];
const defaultProps = {
    onCreateSuccess: () => {},
};

test("A team name with no characters is not valid", () => {
    const component = shallow(<InteractiveCreate {...defaultProps} />);
    component.setState({
        input: {
            value: "",
            error: "",
        },
    });
    expect(component.instance().validateTeamName(component.state("input"))).toBe(false);
});

test("A team name with no characters other than whitespace is not valid", () => {
    const component = shallow(<InteractiveCreate {...defaultProps} />);
    component.setState({
        input: {
            value: "  ",
            error: "",
        },
    });
    expect(component.instance().validateTeamName(component.state("input"))).toBe(false);
});

test("A team name with 255 characters or more is not valid", () => {
    const component = shallow(<InteractiveCreate {...defaultProps} />);
    component.setState({
        input: {
            value: "V7i0FbcdRKCktPlxJk2GjcO3ydrOQsQgVgWiZHnyKojo8M1z613Om1KqOG74MPdlNxqDl1PPsXMJOjvy9PftwQtTctJSg6td4aEiBaSoDkthd2FIC3Qk1UQ9xQbdBL5QLgedFDo0pstSnt3yNRgIGmWCILFvmGKCiU2BFSGYc29CUDDBb1GqEintmDAeeprwsCRZfDGVZjIxdO96WUGyiLBYes40S5HVIiiywffKWYhRYOB0ur7MbfyQbsFylCe",
            error: "",
        },
    });
    expect(component.instance().validateTeamName(component.state("input"))).toBe(false);

    component.setState({
        input: {
            value: "V7i0FbcdRKCktPlxJk2GjcO3ydrOQsQgVgWiZHnyKojo8M1z613Om1KqOG74MPdlNxqDl1PPsXMJOjvy9PftwQtTctJSg6td4aEiBaSoDkthd2FIC3Qk1UQ9xQbdBL5QLgedFDo0pstSnt3yNRgIGmWCILFvmGKCiU2BFSGYc29CUDDBb1GqEintmDAeeprwsCRZfDGVZjIxdO96WUGyiLBYes40S5HVIiiywffKWYhRYOB0ur7MbfyQbsFylCemorecharacters",
            error: "",
        },
    });
    expect(component.instance().validateTeamName(component.state("input"))).toBe(false);

    component.setState({
        input: {
            value: "only16characters",
            error: "",
        },
    });
    expect(component.instance().validateTeamName(component.state("input"))).toBe(true);
});

test("Error message is given when an invalid team name is submitted", () => {
    const component = shallow(<InteractiveCreate {...defaultProps} />);
    component.setState({
        input: {
            ...component.state("input"),
            value: "",
        },
    });

    component.instance().validateTeamName(component.state("input"));
    expect(component.state("input").error.length).toBeGreaterThan(0);
});

test("Error message given if user tries to create a team but doesn't have permissions to do so", async () => {
    const promise = Promise.resolve();
    const component = shallow(<InteractiveCreate {...defaultProps} />);
    const formEvent = {
        preventDefault: () => {},
    };
    component.setState({
        input: {
            ...component.state("input"),
            value: "A new team",
        },
    });

    expect(component.state("input").error).toEqual("");
    await component.instance().handleSubmit(formEvent);
    setImmediate(() => {
        expect(component.state("input").error.length).toBeGreaterThan(0);
    });
});

test("Error message given if user tries to create a team that already exists", async () => {
    const promise = Promise.resolve();
    const component = shallow(<InteractiveCreate {...defaultProps} />);
    const formEvent = {
        preventDefault: () => {},
    };
    component.setState({
        input: {
            ...component.state("input"),
            value: "A new team",
        },
    });

    expect(component.state("input").error).toBe("");
    await component.instance().handleSubmit(formEvent);
    setImmediate(() => {
        expect(component.state("input").error.length).toBeGreaterThan(0);
    });
});

test("Notification is shown if there is any unexpected error during the HTTP request to add a new team", async () => {
    const promise = Promise.resolve();
    const component = shallow(<InteractiveCreate {...defaultProps} />);
    const formEvent = {
        preventDefault: () => {},
    };
    component.setState({
        input: {
            ...component.state("input"),
            value: "A new team",
        },
    });

    expect(mockNotifications.length).toEqual(0);
    await component.instance().handleSubmit(formEvent);
    setImmediate(() => {
        expect(mockNotifications.length).toEqual(1);
    });
});
