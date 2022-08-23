const { defineConfig } = require("cypress");
const getCompareSnapshotsPlugin = require("cypress-image-diff-js/dist/plugin");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    }
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
