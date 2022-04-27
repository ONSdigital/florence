const custom = require("../webpack.config.js");

module.exports = {
  webpackFinal: async (config) => {
    return {
      ...config,
      module: { ...config.module, rules: custom.module.rules },
    };
  },
  stories: ["../app/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
};
