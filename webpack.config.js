const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  target: "node",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },

  devServer: {
    static: "./dist",
  },
};
