import js from "@eslint/js";
import globals from "globals";

// Workaround for globals package bug: some keys have leading/trailing whitespace
const trimKeys = obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.trim(), v]));

export default [
    {
        ignores: ["js/third-party/**", "node_modules/**"]
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: {
                // You may think it sensible to try and add the globals in here to
                // try and activate no-undef or no-unused-vars. We tried to do this
                // using a script which traverses the file tree and dynamically
                // generates all the globals. It worked for those things that are
                // deliberately exported as a global. However there are many other
                // vars that are hoisted to a global scope due to a lack of declaration
                // of var/let/const. There are also many globals created and hoisted
                // when passing functions as parameters. All this means that it's challenging
                // to identify the globals and also challenging to fix them as it may be
                // certain parts of this rely on the hoisting.
                //
                // There be dragons.
                ...trimKeys(globals.browser),
            }
        },
        rules: {
            // There is too much work to fix these with likely disguised
            // consequences due to global variables and hoisting.
            "no-undef": "off",
            "no-unused-vars": "off",
            "no-redeclare": "off",
            "no-useless-escape": "off"
        }
    }
];
