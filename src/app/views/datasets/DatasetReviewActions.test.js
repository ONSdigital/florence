import React from "react";
import DatasetReviewActions from "./DatasetReviewActions";
import { shallow } from "enzyme";

const defaultProps = {
    areDisabled: false,
    includeSaveLabels: false,
    reviewState: undefined,
    userEmail: "user-1@email.com",

    lastEditedBy: undefined,
    onSubmit: undefined,
    onApprove: undefined,
    notInCollectionYet: false,
};

const defaultComponent = shallow(<DatasetReviewActions {...defaultProps} />);

const inProgressProps = {
    ...defaultProps,
    reviewState: "inProgress",
    lastEditedBy: "user-1@email.com",
};

const inProgressComponent = shallow(<DatasetReviewActions {...inProgressProps} />);

const completeProps = {
    ...defaultProps,
    reviewState: "complete",
    lastEditedBy: "user-1@email.com",
};

const completeComponent = shallow(<DatasetReviewActions {...completeProps} />);

const reviewedProps = {
    ...defaultProps,
    reviewState: "reviewed",
    lastEditedBy: "user-2@email.com",
};

const reviewedComponent = shallow(<DatasetReviewActions {...reviewedProps} />);

describe("Renders the correct buttons", () => {
    it("doesn't fail if most props are left undefined", () => {
        expect(defaultComponent.exists()).toBe(true);
    });

    it("can submit a dataset if it's not in a collection yet", () => {
        expect(defaultComponent.props().reviewState).toBeFalsy();
        expect(defaultComponent.props().lastEditedBy).toBeFalsy();

        defaultComponent.setProps({ notInCollectionYet: true });
        expect(defaultComponent.props().id).toBe("submit-for-review");
    });

    it("allows the correct user to submit a dataset for review", () => {
        expect(inProgressComponent.instance().props.lastEditedBy).toBe("user-1@email.com");
        inProgressComponent.setProps({ userEmail: "user-1@email.com" });

        expect(inProgressComponent.props().id).toBe("submit-for-review");
        expect(inProgressComponent.props().disabled).toBe(false);
    });

    it("allows a different user to review a dataset", () => {
        expect(completeComponent.instance().props.lastEditedBy).toBe("user-1@email.com");
        completeComponent.setProps({ userEmail: "user-2@email.com" });

        expect(completeComponent.props().id).toBe("mark-as-reviewed");
        expect(completeComponent.props().disabled).toBe(false);
    });

    it("doesn't allow a user to review their own changes", () => {
        expect(completeComponent.instance().props.lastEditedBy).toBe("user-1@email.com");
        completeComponent.setProps({ userEmail: "user-1@email.com" });

        expect(completeComponent.props().id).not.toBe("mark-as-reviewed");
    });

    it("allow the same user to 'submit for review' again if already submitted and not reviewed", () => {
        expect(completeComponent.instance().props.lastEditedBy).toBe("user-1@email.com");
        completeComponent.setProps({ userEmail: "user-1@email.com" });

        expect(completeComponent.props().id).toBe("submit-for-review");
        expect(completeComponent.props().disabled).toBe(false);
    });

    it("doesn't allow a user to change the review state once reviewed", () => {
        expect(reviewedComponent.instance().props.lastEditedBy).toBe("user-2@email.com");

        expect(reviewedComponent.exists()).toBe(true);

        reviewedComponent.setProps({ userEmail: "user1@email.com" });
        expect(reviewedComponent.props().id).not.toBe("mark-as-reviewed");
        expect(reviewedComponent.props().id).not.toBe("submit-for-review");

        reviewedComponent.setProps({ userEmail: "user-2@email.com" });
        expect(reviewedComponent.props().id).not.toBe("mark-as-reviewed");
        expect(reviewedComponent.props().id).not.toBe("submit-for-review");
    });
});

describe("Run the approve/review handlers", () => {
    it("on 'review' click runs the onReview function", () => {
        let functionHasRun = false;
        inProgressComponent.setProps({
            onSubmit: () => {
                functionHasRun = true;
            },
            userEmail: "user1@email.com",
        });
        expect(functionHasRun).toBe(false);

        inProgressComponent.simulate("click");

        expect(functionHasRun).toBe(true);
    });

    it("on 'approve' click runs the onApprove function", () => {
        let functionHasRun = false;
        completeComponent.setProps({
            onApprove: () => {
                functionHasRun = true;
            },
            userEmail: "user2@email.com",
        });
        expect(functionHasRun).toBe(false);

        completeComponent.simulate("click");

        expect(functionHasRun).toBe(true);
    });
});

describe("Correctly includes/excludes 'save' text in labels", () => {
    it("'submit for review' button excludes by default", () => {
        const label = inProgressComponent.text();
        expect(label.toLowerCase().includes("save")).toBe(false);
    });

    it("'submit for review' button includes when opted for", () => {
        inProgressComponent.setProps({
            includeSaveLabels: true,
        });
        const label = inProgressComponent.text();
        expect(label.toLowerCase().includes("save")).toBe(true);
    });

    it("'mark as reviewed' button excludes by default", () => {
        const label = completeComponent.text();
        expect(label.toLowerCase().includes("save")).toBe(false);
    });

    it("'mark as reviewed' button includes when opted for", () => {
        completeComponent.setProps({
            includeSaveLabels: true,
        });
        const label = completeComponent.text();
        expect(label.toLowerCase().includes("save")).toBe(true);
    });
});

describe("Disables buttons", () => {
    it("optionally disabled", () => {
        inProgressComponent.setProps({ areDisabled: true });
        expect(inProgressComponent.props().disabled).toBe(true);

        completeComponent.setProps({ areDisabled: true });
        expect(completeComponent.props().disabled).toBe(true);
    });

    it("aren't disabled by default", () => {
        inProgressComponent.setProps({ areDisabled: false });
        expect(inProgressComponent.props().disabled).toBe(false);

        completeComponent.setProps({ areDisabled: false });
        expect(completeComponent.props().disabled).toBe(false);
    });
});
