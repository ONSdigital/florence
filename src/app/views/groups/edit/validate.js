function validate(values = {}) {
    const errors = {};
    if (!values.name) {
        errors.name = "Please enter a name";
    }
    return errors;
}
export default validate;
