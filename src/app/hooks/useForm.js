import { useState, useEffect } from "react";

const useForm = (callback, validate, initialValues = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback();
            setValues(initialValues);
        }
    }, [errors]);

    const handleSubmit = e => {
        if (e) e.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);
    };

    const handleChange = e => {
        const key = e.target.name;
        const val = e.target.value;
        setIsSubmitting(false);

        if (Object.keys(errors).length > 0) {
            delete errors[e.target.name];
            setErrors(errors);
        }
        setValues(values => ({ ...values, [key]: val }));
    };

    return {
        handleChange,
        handleSubmit,
        values,
        errors,
    };
};
export default useForm;
