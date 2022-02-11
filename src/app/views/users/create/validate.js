function validate(values = {}) {
    const errors = {};
    if (!values.forename) {
        errors.forename = "Please enter a first name";
    }
    if (!values.lastname) {
        errors.lastname = "Please enter a last name";
    }
    if (!values.email) {
        errors.email = "Please enter an email address";
    }
    return errors;
}
export default validate;
