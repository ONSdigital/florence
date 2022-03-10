import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BackButton from "../../../components/back-button";
import Loader from "../../../components/loader";
import Input from "../../../components/Input";
import validate from "./validate";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import FormFooter from "../../../components/form-footer/FormFooter";

const EditGroup = props => {
    const id = props.params.id;

    useEffect(() => {
        if (id) {
            props.loadGroup(id);
        }
    }, [id]);

    const { group, loading, updateGroup } = props;
    const [values, setValues] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasErrors = !isEmpty(errors);
    const hasNewValues = !isEqual(values, group);

    const routerWillLeave = nextLocation => {
        if (hasNewValues && !isSubmitting) return "Your work is not saved! Are you sure you want to leave?";
    };

    useEffect(() => {
        props.router.setRouteLeaveHook(props.route, routerWillLeave);
    });

    useEffect(() => {
        if (group) {
            setValues({ ...group }); // ths is not necessary but in future we will edit more fields
        }
    }, [group]);

    const handleSubmit = e => {
        if (e) e.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);

        if (hasErrors || values.name === "") return;
        updateGroup(id, values);
    };

    const handleChange = e => {
        const key = e.target.name;
        const val = e.target.value;
        setIsSubmitting(false);

        if (hasErrors) {
            delete errors[e.target.name];
            setErrors(errors);
        }
        setValues(values => ({ ...values, [key]: val }));
    };

    if (!group) return <h1>No group found.</h1>;
    if (loading) return <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />;

    return (
        <form className="form">
            <div className="grid grid--justify-space-around">
                <div className="grid__col-9">
                    <BackButton classNames="margin-top--2" />
                    <h1 className="margin-top--1 margin-bottom--1">{group.name}</h1>
                    <div className="grid__col-6">
                        <Input
                            error={errors?.name}
                            id="name"
                            label="Name"
                            name="name"
                            type="text"
                            value={values ? values.name : ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <FormFooter hasNewValues={hasNewValues} hasErrors={hasErrors} loading={loading} handleSubmit={handleSubmit} />
            </div>
        </form>
    );
};

EditGroup.prototype = {
    params: PropTypes.objectOf({id: PropTypes.string.isRequired} ),
    group: PropTypes.exact({
        created: PropTypes.string,
        id: PropTypes.string,
        members: PropTypes.array,
        name: PropTypes.string,
        precedence: PropTypes.number,
    }).isRequired,
    updateGroup: PropTypes.func.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default EditGroup;
