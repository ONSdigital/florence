
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

    // /**
    //  * Add a year, month or day to the a date
    //  * 
    //  * @param {date object} date - (optional) A date object
    //  * @param {integer} extraYears - (optional) Number of years to add to the date
    //  * @param {integer} extraMonths - (optional) Number of months to add to the date
    //  * @param {integer} extraDays - (optional) Number of days to add to the date
    //  * @param {boolean} useCurrentTime - (optional) Only use when a date isn't being passed in. Set to 'true' to use the current time otherwise it will return the time that the application was loaded
    //  * 
    //  * @returns {date object} - The new date with the added years/months/days
    //  */
    // static addToDate(date, extraYears = 0, extraMonths = 0, extraDays = 0, useCurrentTime = false) {
    //     if (!date) {
    //         date = useCurrentTime ? this.getNow() : today;
    //     }

    //     if (extraYears && typeof extraYears === "string") {
    //         try {
    //             extraYears = parseInt(extraYears);
    //         } catch (error) {
    //             extraYears = 0;
    //             log.add(eventTypes.unexpectedRuntimeError, {message: "Error attempting to add year to a date because string couldn't be parsed to an integer: " + JSON.stringify(error)});
    //             console.error(`Error attempting to add year '${extraYears}' to a date because string couldn't be parsed to an integer`, error);
    //         }
    //     }
        
    //     if (extraMonths && typeof extraMonths === "string") {
    //         try {
    //             extraMonths = parseInt(extraMonths);
    //         } catch (error) {
    //             extraMonths = 0;
    //             log.add(eventTypes.unexpectedRuntimeError, {message: `Error attempting to add month '${extraMonths}' to a date because string couldn't be parsed to an integer: ` + JSON.stringify(error)});
    //             console.error(`Error attempting to add month '${extraMonths}' to a date because string couldn't be parsed to an integer`, error);
    //         }
    //     }
        
    //     if (extraDays && typeof extraDays === "string") {
    //         try {
    //             extraDays = parseInt(extraMonths);
    //         } catch (error) {
    //             extraDays = 0;
    //             log.add(eventTypes.unexpectedRuntimeError, {message: `Error attempting to add day '${extraDays}' to a date because string couldn't be parsed to an integer: ` + JSON.stringify(error)});
    //             console.error(`Error attempting to add day '${extraDays}' to a date because string couldn't be parsed to an integer`, error);
    //         }
    //     }

    //     let currentDate = date.getDate();
    //     let currentMonth = date.getMonth();
    //     let currentYear = date.getFullYear();
    //     let newDate = date;

    //     // if (extraDays && extraDays !== 0) {
    //     //     newDate.setDate(currentDate + extraDays);
    //     // }
        
    //     if (extraMonths && extraMonths !== 0) {
    //         console.log(newDate);
    //         newDate.setMonth(currentMonth + extraMonths);
    //         console.log(newDate);
    //     }
        
    //     // if (extraYears && extraYears !== 0) {
    //     //     newDate.setFullYear(currentYear + extraYears);
    //     // }

    //     // console.log(newDate);

    //     // return new Date(newYears, newMonths, newDays, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    //     return newDate;
    // }
    
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
            date = today;
        }
        return dateFormat(date, format);
    }

}