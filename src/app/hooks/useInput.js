import { useState } from "react";

export function useInput(initialValue, autoSubmitInput) {
    const [value, setValue] = useState(initialValue);

    const handleOnChange = e => {
        const value = e.target.value;
        setValue(value);
        if (!autoSubmitInput) {
            return;
        }
        autoSubmitInput(value);
    };

    return [
        {
            value,
            onChange: handleOnChange,
        },
        () => setValue(initialValue),
    ];
}
