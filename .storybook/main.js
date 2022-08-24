module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  // added for framer-motion errors
  // https://stackoverflow.com/questions/72710138/framer-motion-with-storybook-error-in-build-environment
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    const leafletRule = {
      test: /\.js$/,
      include: [/node_modules\/@react-leaflet/, /node_modules\/react-leaflet/],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { modules: "commonjs" }]],
          },
        },
      ],
    };
    config.module.rules.push(leafletRule);
    return config;
  },
};
