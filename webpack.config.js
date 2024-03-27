const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: './js/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './js'),
	},
	module: {
		rules: [
			{
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
		]
	},
	devServer: {
        historyApiFallback: true,
        static: {
			directory: path.join(__dirname, './'),
		  },
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
	plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
}
