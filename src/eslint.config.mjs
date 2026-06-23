import globals from "globals";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";

// Workaround for globals package bug: some keys have leading/trailing whitespace
const trimKeys = obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.trim(), v]));

export default [
    {
        ignores: ["legacy/**", "node_modules/**"]
    },
    js.configs.recommended,
    reactPlugin.configs.flat.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...trimKeys(globals.browser),
                ...trimKeys(globals.es2015),
                ...trimKeys(globals.jest),
                ...trimKeys(globals.node),
                jsdom: "writable",
            }
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            "no-undef": "error",
            "no-console": "off",
            "react/no-set-state": "off",
            "react/prop-types": "warn",
            "react/prefer-stateless-function": "off",
            "react/jsx-curly-spacing": ["off", "always"],
            "react/require-optimization": "off",
            "react/jsx-max-props-per-line": "off",
            "react/jsx-sort-props": "off",
            "react/jsx-no-literals": "off",
            "react/sort-comp": "warn",
            "react/no-direct-mutation-state": "error",
            "react/no-unescaped-entities": "off"
        }
    },
    {
        files: ["**/*.test.js"],
        rules: {
            "no-unused-vars": "warn"
        }
    },
    prettierConfig
];
