
import dateFormat from 'dateformat';
import log, {eventTypes} from './log'

export default class date {

    /**
     * Get today's date and the current time - if you don't need the exact time then use getToday()
     * 
     * @returns {date object} - Today's date with the current time
     */
    static getNow() {
        return new Date(Date.now());
    }

    /**
     * Add a year to a specific date or the current date and time
     * 
     * @param {integer} extraYears - Number of years to add to the date.
     * @param {date object} date - (Optional) Date object to add the year(s) to. Otherwise the current date is used.
     * 
     * @returns {date object} - New date object with added year(s)
     */
    static addYear(extraYears = 0, date) {
        if (!date) {
            date = this.getNow();
        }

        // Note: This implementation will be limited. 
        // E.g. trying to add a year on a leap year day will return the date but rounded up to the nearest day, because the current one doesn't exist.
        // Code example: var x = new Date("2016-02-29"); x.setFullYear(2017); 'x' will equal return the date for 2017-03-01
        // If we're starting to need more complex date maths then consider MomentJS (heavier but full featured) or 'add-subtract-date' (lighter but does less)
        let newDate;
        try {
            newDate = new Date(date);
            newDate.setFullYear(date.getFullYear() + extraYears);
        } catch (error) {
            newDate = date;
            log.add(eventTypes.unexpectedRuntimeError, {message: "Error adding " + extraYears + " year(s) to the date " + date + ". Error: " + JSON.stringify(error)})
            console.error("Error adding " + extraYears + "year(s) to the date " + date, error);
        }

        return newDate;
    }
    
    /**
     * Add a year, month or day to the a date
     * 
     * @param {date object} date - (optional) A date object
     * @param {string} format - (optional) A string of the date/time pattern to use - must match pattenrs from https://www.npmjs.com/package/dateformat
     * 
     * @returns {string} - Formatted date string
     */
    static format(date, format) {
        if (!date) {
            date = this.getNow();
        }
        return dateFormat(date, format);
    }

}