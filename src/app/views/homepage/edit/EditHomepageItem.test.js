import React from "react";
import EditHomepageItem from "./EditHomepageItem";
import { shallow, mount } from "enzyme";

import image from "../../../utilities/api-clients/images";
import log from "../../../utilities/logging/log";

jest.mock("../../../utilities/api-clients/images", () => {
    return {
        create: jest.fn(() => {
            return Promise.resolve({ id: "test-image-id" });
        }),
        get: jest.fn(() => {
            return Promise.resolve();
        }),
        update: jest.fn(() => {
            return Promise.resolve();
        }),
        getDownloads: jest.fn(() => {
            return Promise.resolve();
        }),
    };
});

jest.mock("../../../components/file-upload/bind", () => {
    return {
        bindFileUploadInput: jest.fn(() => {}),
    };
});
jest.mock("../../../utilities/logging/log", () => {
    return {
        event: jest.fn(() => {}),
        data: jest.fn(() => {}),
        error: jest.fn(() => {}),
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {},
    };
});

console.error = () => {};

const nullParamProps = {
    params: {
        homepageDataField: null,
        homepageDataFieldID: null,
    },
    handleSuccessClick: () => {},
    handleCancelClick: () => {},
};

const successRouteProps = {
    data: {
        id: 0,
        description: "Test description",
        uri: "/",
        title: "Test title",
        image: "",
    },
    params: {
        homepageDataField: "featuredContent",
        homepageDataFieldID: 0,
        collectionID: "test-collection",
    },
    handleSuccessClick: jest.fn(),
    handleCancelClick: jest.fn(),
};

const mockImage = {
    id: "test-image-001",
    upload: { path: "fake/upload/path" },
};

let mockNotifications = [];

beforeEach(() => {
    mockNotifications = [];
    image.getDownloads.mockClear();
});

jest.useFakeTimers();

describe("different item states", () => {
    it("maps the propagated data to the fields", () => {
        const wrapper = mount(<EditHomepageItem {...successRouteProps} />);
        const inputs = wrapper.find("input");
        const textarea = wrapper.find("textarea");
        expect(inputs.length).toBe(3);
        expect(textarea.length).toBe(1);
    });
    it("renders something went wrong message when unsupported field type is passed ", () => {
        const wrapper = shallow(<EditHomepageItem {...nullParamProps} />);
        const defaultMessage = wrapper.find("p");
        expect(defaultMessage.text()).toEqual("Something went wrong: unsupported field type");
        expect(wrapper.state("id")).toBe(null);
        expect(wrapper.state("description")).toBe("");
        expect(wrapper.state("title")).toBe("");
        expect(wrapper.state("uri")).toBe("");
    });
});

describe("event handlers", () => {
    it("updates the input value when the input field is changed", () => {
        const wrapper = shallow(<EditHomepageItem {...successRouteProps} />);
        const mockEvent = {
            target: {
                value: "New value",
                name: "title",
            },
        };
        wrapper.instance().handleInputChange(mockEvent);
        expect(wrapper.state("title")).toBe("New value");
    });
    it("calls the cancel handler when clicked", () => {
        const wrapper = shallow(<EditHomepageItem {...successRouteProps} />);
        const cancelButton = wrapper.find("#cancel");
        cancelButton.simulate("click");
        expect(successRouteProps.handleCancelClick).toBeCalled();
    });
    it("calls the continue handler when clicked", () => {
        const wrapper = shallow(<EditHomepageItem {...successRouteProps} />);
        const cancelButton = wrapper.find("#continue");
        cancelButton.simulate("click");
        expect(successRouteProps.handleSuccessClick).toBeCalled();
    });
});

describe("create image record", () => {
    const wrapper = mount(<EditHomepageItem {...successRouteProps} />);
    it("updates isCreatingImageRecord state to show it's creating image record", () => {
        expect(wrapper.state("isCreatingImageRecord")).toBe(false);

        wrapper.instance().createImageRecord();
        expect(wrapper.state("isCreatingImageRecord")).toBe(true);
    });

    it("updates state to show it has created image record", async () => {
        await wrapper.instance().createImageRecord();
        expect(wrapper.state("isCreatingImageRecord")).toBe(false);
        expect(wrapper.state("image")).toBe("test-image-id");
        expect(wrapper.state("imageState")).toBe("created");
    });

    it("updates isCreatingImageRecords state correctly on failure to fetch data for all datasets", async () => {
        image.create.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await wrapper.instance().createImageRecord();
        expect(wrapper.state("isCreatingImageRecord")).toBe(false);
    });

    it("errors cause notification", async () => {
        image.create.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await wrapper.instance().createImageRecord();
        expect(mockNotifications.length).toBe(1);
    });
});

describe("add upload to image record", () => {
    const wrapper = mount(<EditHomepageItem {...successRouteProps} />);
    it("updates isUpdatingImageRecord state to show it's creating image record", () => {
        expect(wrapper.state("isUpdatingImageRecord")).toBe(false);

        wrapper.instance().addUploadToImageRecord(mockImage.id, mockImage.upload.path);
        expect(wrapper.state("isUpdatingImageRecord")).toBe(true);
    });

    it("updates isUpdatingImageRecord state to show it has created image record", async () => {
        await wrapper.instance().addUploadToImageRecord(mockImage.id, mockImage.upload.path);
        expect(wrapper.state("isUpdatingImageRecord")).toBe(false);
    });

    it("updates isCreatingImageRecords state correctly on failure to fetch data for all datasets", async () => {
        image.update.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await wrapper.instance().addUploadToImageRecord(mockImage.id, mockImage.upload.path);
        expect(wrapper.state("isUpdatingImageRecord")).toBe(false);
    });

    it("errors cause notification", async () => {
        image.update.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await wrapper.instance().addUploadToImageRecord(mockImage.id, mockImage.upload.path);
        expect(mockNotifications.length).toBe(1);
    });
});

describe("get image upload ", () => {
    const wrapper = mount(<EditHomepageItem {...successRouteProps} />);
    it("updates isGettingImage state to show it's getting image", () => {
        expect(wrapper.state("isGettingImage")).toBe(false);

        wrapper.instance().getImageDownload(mockImage.id);
        expect(wrapper.state("isGettingImage")).toBe(true);
    });

    it("updates isUpdatingImageRecord state to show it has created image record", async () => {
        await wrapper.instance().getImageDownload(mockImage.id);
        expect(wrapper.state("isGettingImage")).toBe(false);
    });

    it("updates isCreatingImageRecords state correctly on failure to fetch data for all datasets", async () => {
        image.getDownloads.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await wrapper.instance().getImageDownload(mockImage.id);
        expect(wrapper.state("isGettingImage")).toBe(false);
    });

    it("errors cause notification", async () => {
        image.getDownloads.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await wrapper.instance().getImageDownload(mockImage.id);
        expect(mockNotifications.length).toBe(1);
    });
});

describe("get image", () => {
    const wrapper = mount(<EditHomepageItem {...successRouteProps} />);
    it("updates isGettingImage state to show it's getting image", () => {
        expect(wrapper.state("isGettingImage")).toBe(false);

        wrapper.instance().getImage(mockImage.id);
        expect(wrapper.state("isGettingImage")).toBe(true);
    });

    it("updates isUpdatingImageRecord state to show it has created image record", async () => {
        await wrapper.instance().getImage(mockImage.id);
        expect(wrapper.state("isGettingImage")).toBe(false);
    });

    it("when response.status is 'completed' or 'publishing' calls to get image download", async () => {
        image.get.mockImplementationOnce(() => Promise.resolve({ state: "completed" }));
        await wrapper.instance().getImage(mockImage.id);
        expect(image.getDownloads.mock.calls[0][0].length).toBeGreaterThan(0);
        expect(wrapper.state("isGettingImage")).toBe(false);
    });

    it("when response.status is 'error' we log the error", async () => {
        image.get.mockImplementationOnce(() => Promise.resolve({ state: "failed_import" }));
        await wrapper.instance().getImage(mockImage.id);
        expect(log.event.mock.calls[0][0].length).toBeGreaterThan(0);
        expect(wrapper.state("isGettingImage")).toBe(false);
    });

    it("updates isCreatingImageRecords state correctly on failure to fetch data for all datasets", async () => {
        image.get.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await wrapper.instance().getImage(mockImage.id);
        expect(wrapper.state("isGettingImage")).toBe(false);
    });

    it("errors cause notification", async () => {
        image.get.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await wrapper.instance().getImage(mockImage.id);
        expect(mockNotifications.length).toBe(1);
    });
});
