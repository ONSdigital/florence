const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "source-map",
  entry: {
    app: ["./index.js"],
    tablebuilder: "./tablebuilder/tablebuilder.js",
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].bundle.js",
  },
  resolve: {
    fallback: { url: false },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx"],
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true,
                  },
                },
              ],
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: { limit: 100000 },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "refactored.html", to: "refactored.html" },
        { from: "manifest.json", to: "manifest.json" },
        { from: "service-worker.js", to: "service-worker.js" },
        { from: "img", to: "img" },
      ],
    }),
    new MiniCssExtractPlugin({ filename: "css/[name].css" }),
  ],
  externals: {
    resumeablejs: "Resumable",
  },
};
