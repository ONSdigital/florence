export const customStyles = {
    option: (styles, state) => ({
        ...styles,
        color: "black",
        backgroundColor: state.isSelected ? "#ddd" : state.isFocused ? "#ddd" : "white",
        ":active": {
            ...styles[":active"],
            backgroundColor: state.isSelected ? "#ddd" : "#ddd",
        },
        padding: 20,
    }),
    container: (styles, state) => ({
        ...styles,
        border: "3px solid #58585B",
        borderRadius: "4px",
        boxShadow: state.isFocused ? "0 0 0 3px #ffbf47" : "none",
        backgroundColor: "#FFFFFF",
        outlineStyle: "none",
        bottom: "100%",
    }),
    control: styles => ({
        ...styles,
        border: "none",
        backgroundColor: "transparent",
    }),
    multiValueRemove: styles => ({
        ...styles,
        ":hover": {
            backgroundColor: "#ddd",
            color: "#333333",
        },
    }),
};
