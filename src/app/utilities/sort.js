export default class sort {
    /**
     * A function to pass into a sort function's callback to order a list alphabetically.
     * localeCompare is an ES6 method that returns a number indicating whether a reference string
     * comes before (negative number), or after (positive number), or is the same as the given string in sort order (0).
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
     *
     * @param {string} firstCase - the first comparator
     * @param {string} secondCase - the second comparator
     * @returns {number} - A number which indicates whether the reference string comes before or after the given string
     */
    static alphabetically(firstCase, secondCase) {
        return firstCase.localeCompare(secondCase);
    }
}
