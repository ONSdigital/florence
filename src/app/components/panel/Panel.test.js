import React from "react";
import Panel from "./Panel.jsx";
import renderer from "react-test-renderer";

test("error panel with a heading and a bullet point list ", () => {
    const ErrorPanelBody = () => {
        return (
            <ol className="list">
                <li className="list__item ">
                    <a href="#container-test-number" className="list__link js-inpagelink">
                        Enter a number
                    </a>
                </li>
                <li className="list__item ">
                    <a href="#container-test-percent" className="list__link js-inpagelink">
                        Enter a number less than or equal to 100
                    </a>
                </li>
            </ol>
        );
    };

    const props = {
        type: "error",
        heading: "There are 2 problems: ",
        body: <ErrorPanelBody />,
        bannerHeading: true,
    };
    const component = renderer.create(<Panel {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("information panel with no heading and raw string for body", () => {
    const props = {
        type: "information",
        body:
            "In principle but likewise practice this is a relatively simple but important message. " +
            "The fact of the matter is that you had absolutely no idea and therefore did not know " +
            "whether or not it was vital for you to spend the time to read this message until you actually " +
            "started to consume the words which this message contains. Now that you have " +
            "started to read it this message can help you realise that the nature of this message is to " +
            "inform you that you have indeed actually now read this message.",
    };
    const component = renderer.create(<Panel {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("error type panel with a regular heading and body", () => {
    const props = {
        type: "error",
        heading: "Fix the following: ",
        body: "Email address or password are incorrect",
    };
    const component = renderer.create(<Panel {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("success panel with a tick icon and a raw text body", () => {
    const props = {
        type: "success",
        body: "Information has been successfully submitted",
        icon: "tick",
    };
    const component = renderer.create(<Panel {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("error panel with a regular heading and an input field", () => {
    const props = {
        type: "error",
        heading: "Enter a number ",
        bannerHeading: false,
        input: {
            pattern: "[0-9]",
            id: "number",
            type: "text",
            label: "Number of employees paid monthly",
            inputMode: "numeric",
        },
    };
    const component = renderer.create(<Panel {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
test("announcement panel with custom html in body and an icon and no heading", () => {
    const AnnouncementPanelBody = () => {
        return (
            <p>
                "Coronavirus lockdown: stay at home Coronavirus (COVID-19) remains a serious threat across the country. <a href="#0">Find out more</a>
            </p>
        );
    };
    const props = {
        type: "announcement",
        body: <AnnouncementPanelBody />,
        icon: "arrow",
    };
    const component = renderer.create(<Panel {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
test("warning panel with an exclamation icon and raw string body", () => {
    const props = {
        type: "warning",
        body: "All the information about this person will be deleted",
        icon: "exclamation",
    };
    const component = renderer.create(<Panel {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
