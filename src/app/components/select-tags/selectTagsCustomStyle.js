export const customStyles = error => {
    return {
        option: (styles, state) => ({
            ...styles,
            color: state.isDisabled ? "#58585b" : "black",
            backgroundColor: state.isSelected ? "#ddd" : state.isFocused ? "#ddd" : "white",
            ":active": {
                ...styles[":active"],
                backgroundColor: state.isSelected ? "#ddd" : "#ddd",
            },
            padding: 20,
        }),
        container: (styles, state) => ({
            ...styles,
            zIndex: state.isFocused ? 1 : 0,
            border: "3px solid " + (error ? "#aa354c" : state.isDisabled ? "#aea99c" : "#58585B"),
            borderRadius: "4px",
            boxShadow: state.isFocused ? "0 0 0 3px #ffbf47" : "none",
            backgroundColor: error ? "#f7e7ea" : state.isDisabled ? "#e2e2e3" : "#FFFFFF",
        }),
        control: styles => ({
            ...styles,
            border: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
        }),
        multiValueRemove: styles => ({
            ...styles,
            ":hover": {
                backgroundColor: "#ddd",
                color: "#333333",
            },
        }),
    };
};
