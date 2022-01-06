function validate(values = {}) {
    const errors = {};
    if (!values.title) {
        errors.title = "Title is required";
    }
    if (!values.type) {
        errors.type = "Type is required";
    }
    if (!values.description) {
        errors.description = "Description is required";
    }
    if (values.uri && !values.linkText) {
        errors.linkText = "Link text is required";
    }
    if (values.linkText && !values.uri) {
        errors.uri = "Link url is required";
    }
    return errors;
}
export default validate;
