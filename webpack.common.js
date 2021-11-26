const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
  target: "node",
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  plugins: [new NodemonPlugin()],
};
