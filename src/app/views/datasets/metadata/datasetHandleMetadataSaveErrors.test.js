import handleMetadataSaveErrors from "./datasetHandleMetadataSaveErrors";
import notifications from "../../../utilities/notifications";

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(() => {
            //
        }),
    };
});
const errors = {
    badRequest: {
        status: 400,
    },
    unauthorised: {
        status: 401,
    },
    forbidden: {
        status: 403,
    },
    notFound: {
        status: 404,
    },
    networkErr: {
        status: "FETCH_ERR",
    },
    unexpected: {
        status: 500,
    },
};

describe("Errors when updating the review state or saving metadata updates", () => {
    it("return 'true' if any error occurs", () => {
        expect(handleMetadataSaveErrors(errors.unauthorised, {})).toBe(true);
        expect(handleMetadataSaveErrors(errors.badRequest, errors.badRequest)).toBe(true);
        expect(handleMetadataSaveErrors({}, errors.badRequest)).toBe(true);
    });

    it("don't add a notification when either/both requests return a 401", () => {
        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.unauthorised, {});
        expect(notifications.add.mock.calls.length).toBe(0);

        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.unauthorised, errors.unauthorised);
        expect(notifications.add.mock.calls.length).toBe(0);
    });

    it("add the correct notification when both requests fail for the same reason", () => {
        notifications.add.mockReset();
        const expectedErrMsg =
            "Unable to submit for review and save your metadata updates due to a network issue. Please check your internet connection and try again";
        handleMetadataSaveErrors(errors.networkErr, errors.networkErr, true, false);
        expect(notifications.add.mock.calls.length).toBe(1);
        const errorMsg = notifications.add.mock.calls[0][0].message;
        expect(errorMsg).toBe(expectedErrMsg);
    });

    it("add the correct notifications when both requests fail for different reasons", () => {
        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.networkErr, errors.forbidden, false, true);
        expect(notifications.add.mock.calls.length).toBe(2);

        const metadataErrorMsg = notifications.add.mock.calls[0][0].message;
        const reviewErrorMsg = notifications.add.mock.calls[1][0].message;
        expect(metadataErrorMsg).toBe(
            "Unable to save your metadata updates due to a network issue. Please check your internet connection and try again"
        );
        expect(reviewErrorMsg).toBe("Unable to submit for approval because you do not have the correct permissions");
    });

    it("add the correct notification when one/both requests return a 400", () => {
        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.badRequest, errors.badRequest, true, false);
        let errorMsg = notifications.add.mock.calls[0][0].message;
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(errorMsg).toBe(
            "Unable to submit for review and save your metadata updates due to invalid values being submitted. Please check your updates for any issues and try again"
        );

        handleMetadataSaveErrors(errors.badRequest, {}, true, false);
        errorMsg = notifications.add.mock.calls[1][0].message;
        expect(notifications.add.mock.calls.length).toBe(2);
        expect(errorMsg).toBe(
            "Unable to save your metadata updates due to invalid values being submitted. Please check your updates for any issues and try again"
        );

        handleMetadataSaveErrors({}, errors.badRequest, false, true);
        errorMsg = notifications.add.mock.calls[2][0].message;
        expect(notifications.add.mock.calls.length).toBe(3);
        expect(errorMsg).toBe(
            "Unable to submit for approval due to invalid values being submitted. Please check your updates for any issues and try again"
        );
    });

    it("add the correct notification when one/both requests return a 403", () => {
        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.forbidden, errors.forbidden, false, true, "my-collection-12345");
        let errorMsg = notifications.add.mock.calls[0][0].message;
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(errorMsg).toBe("Unable to submit for approval and save your metadata updates because you do not have the correct permissions");

        handleMetadataSaveErrors(errors.forbidden, {}, true, false);
        errorMsg = notifications.add.mock.calls[1][0].message;
        expect(notifications.add.mock.calls.length).toBe(2);
        expect(errorMsg).toBe("Unable to save your metadata updates because you do not have the correct permissions");

        handleMetadataSaveErrors({}, errors.forbidden, true, false, "my-collection-12345");
        errorMsg = notifications.add.mock.calls[2][0].message;
        expect(notifications.add.mock.calls.length).toBe(3);
        expect(errorMsg).toBe("Unable to submit for review because you do not have the correct permissions");
    });

    it("add the correct notification when one/both requests return a 404", () => {
        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.notFound, errors.notFound, false, true, "my-collection-12345");
        let errorMsg = notifications.add.mock.calls[0][0].message;
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(errorMsg).toBe(
            "Unable to submit for approval and save your metadata updates because this collection (my-collection-12345) and dataset couldn't be found"
        );

        handleMetadataSaveErrors(errors.notFound, {}, true, false);
        errorMsg = notifications.add.mock.calls[1][0].message;
        expect(notifications.add.mock.calls.length).toBe(2);
        expect(errorMsg).toBe("Unable to save your metadata updates because this dataset couldn't be found");

        handleMetadataSaveErrors({}, errors.notFound, true, false, "my-collection-12345");
        errorMsg = notifications.add.mock.calls[2][0].message;
        expect(notifications.add.mock.calls.length).toBe(3);
        expect(errorMsg).toBe("Unable to submit for review because this collection (my-collection-12345) couldn't be found");
    });

    it("add the correct notification when one/both requests return a network error", () => {
        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.networkErr, errors.networkErr, true, false, "my-collection-12345");
        let errorMsg = notifications.add.mock.calls[0][0].message;
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(errorMsg).toBe(
            "Unable to submit for review and save your metadata updates due to a network issue. Please check your internet connection and try again"
        );

        handleMetadataSaveErrors(errors.networkErr, {}, true, false);
        errorMsg = notifications.add.mock.calls[1][0].message;
        expect(notifications.add.mock.calls.length).toBe(2);
        expect(errorMsg).toBe("Unable to save your metadata updates due to a network issue. Please check your internet connection and try again");

        handleMetadataSaveErrors({}, errors.networkErr, true, false, "my-collection-12345");
        errorMsg = notifications.add.mock.calls[2][0].message;
        expect(notifications.add.mock.calls.length).toBe(3);
        expect(errorMsg).toBe("Unable to submit for review due to a network issue. Please check your internet connection and try again");
    });

    it("add the correct notification when one/both requests return an unexpected error", () => {
        notifications.add.mockReset();
        handleMetadataSaveErrors(errors.unexpected, errors.unexpected, true, false, "my-collection-12345");
        let errorMsg = notifications.add.mock.calls[0][0].message;
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(errorMsg).toBe("Unable to submit for review and save your metadata updates due to an unexpected error");

        handleMetadataSaveErrors(errors.unexpected, {}, true, false);
        errorMsg = notifications.add.mock.calls[1][0].message;
        expect(notifications.add.mock.calls.length).toBe(2);
        expect(errorMsg).toBe("Unable to save your metadata updates due to an unexpected error");

        handleMetadataSaveErrors({}, errors.unexpected, true, false, "my-collection-12345");
        errorMsg = notifications.add.mock.calls[2][0].message;
        expect(notifications.add.mock.calls.length).toBe(3);
        expect(errorMsg).toBe("Unable to submit for review due to an unexpected error");
    });
});
