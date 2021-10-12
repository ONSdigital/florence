import date from "./date";

jest.mock("../utilities/logging/log", () => ({
    event: () => {},
}));

test("Getting the current date and time works correctly", () => {
    expect(date.getNow()).toEqual(new Date("2017-10-06T13:45:28.975Z"));
});

describe("Adding to a date", () => {
    const currentDateTime = new Date(Date.now());
    const customDate = new Date("2018-01-14 09:35:13");
    const leapYearDate = new Date("2016-02-29");

    it("uses the current date if one isn't given", () => {
        expect(date.addYear(0)).toEqual(currentDateTime);
        expect(date.addYear(0, null)).toEqual(currentDateTime);
        expect(date.addYear(0, undefined)).toEqual(currentDateTime);
        expect(date.addYear(0, "")).toEqual(currentDateTime);
    });

    it("adds a single year when the default date is used", () => {
        expect(date.addYear(1)).toEqual(new Date("2018-10-06T13:45:28.975Z"));
    });

    it("adds multiple years correctly when the default date is used", () => {
        expect(date.addYear(5)).toEqual(new Date("2022-10-06T13:45:28.975Z"));
    });

    it("adds a single year for a custom date correctly", () => {
        expect(date.addYear(1, customDate)).toEqual(new Date("2019-01-14T09:35:13.000Z"));
    });

    it("adds multiple years for a custom date correctly", () => {
        expect(date.addYear(5, customDate)).toEqual(new Date("2023-01-14T09:35:13.000Z"));
    });

    it("rounds the date to the nearest existing day if adding a year results in a non-existant date", () => {
        expect(date.addYear(1, leapYearDate)).toEqual(new Date("2017-03-01"));
    });
});

// Not going to write many tests here because the date format library is already tested
// we just want to check that our abstraction hasn't broken
describe("Formatting a date", () => {
    const format = "UTC:ddd, d/m/yyyy h:MM:ss";
    const mockedDate = new Date("2018-01-10T14:02:30.513Z");

    it("returns a string of a passed in date", () => {
        expect(date.format(mockedDate, format)).toBe("Wed, 10/1/2018 2:02:30");
    });

    it("returns a string of just the time of a passed in date", () => {
        expect(date.format(mockedDate, "h:MM:ss")).toBe("2:02:30");
    });

    it("returns a string of just the date of a passed in date", () => {
        expect(date.format(mockedDate, "yyyy/mm/dd")).toBe("2018/01/10");
    });

    it("uses the current date by default", () => {
        expect(date.format(new Date(Date.now()), format)).toBe("Fri, 6/10/2017 1:45:28");
    });
});
