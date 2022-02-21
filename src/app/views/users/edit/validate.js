function validate(values = {}) {
    const errors = {};
    if (!values.forename) {
        errors.forename = "Please enter a first name";
    }
    if (!values.lastname) {
        errors.lastname = "Please enter a last name";
    }
    return errors;
}
export default validate;
