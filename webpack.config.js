const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');


const nodeExternal = nodeExternals({});

module.exports = [
	{
		name: 'node:server',
		entry: './src/server/server.js',
		output: {
			filename: 'server.js',
			path: __dirname + '/dist',
			libraryTarget: 'commonjs2'
		},
		target: 'node',
		externals: [nodeExternal],
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loaders: ['babel']
				}
			]
		},
		devtool: 'source-map'
	}
]
