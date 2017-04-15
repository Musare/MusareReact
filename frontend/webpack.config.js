const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const nodeEnv = process.env.NODE_ENV || "development";

const plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name: "commons",
		filename: "[name]-[hash].js",
		chunks: ["vendor", "app"]
	}),
	new HtmlWebpackPlugin({
		hash: true,
		chunks: ["commons", "app"],
		template: "index.tpl.html",
		inject: "body",
		filename: "index.html"
	}),
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    "process.env": {
			NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            "last 3 version",
            "ie >= 10",
          ],
        }),
      ],
      context: path.join(__dirname, "./app"),
    },
  }),
];

const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      "babel-loader",
    ],
  },
  {
    test: /\.(png|gif|jpg|svg)$/,
    include: path.join(__dirname, "./app/assets/images"),
    use: "url-loader?limit=20480&name=assets/[name]-[hash].[ext]",
  },
];

if (nodeEnv === "production") {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin("style-[hash].css")
  );

  rules.push({
		test: /\.scss$/,
		loader: ExtractTextPlugin.extract({
			fallback: "style-loader",
			use: "css-loader!postcss-loader!sass-loader",
		})
	});
} else {
  rules.push({
		test: /\.scss$/,
		exclude: /node_modules/,
		use: [
			"style-loader",
			// "css-loader?sourceMap",
			"css-loader",
			"postcss-loader",
			"sass-loader?sourceMap",
		]
	});
}

module.exports = {
  devtool: nodeEnv === "production" ? "eval" : "source-map",
  context: path.join(__dirname, "./app"),
  entry: {
    app: "./js/index.js",
    vendor: [
      "babel-polyfill",
      "es6-promise",
      "immutable",
      "isomorphic-fetch",
      "react-dom",
      "react-redux",
      "react-router",
      "react",
      "redux-thunk",
      "redux",
    ],
  },
  output: {
    path: path.join(__dirname, "./dist"),
    publicPath: "/",
    filename: "[name]-[hash].js",
  },
  module: {
    rules,
  },
  resolve: {
    extensions: [".webpack-loader.js", ".web-loader.js", ".loader.js", ".js", ".jsx"],
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.join(__dirname, "./app/js"),
    ],
  },
  plugins
};
