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
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loaders: ['babel-loader']
				}
			]
		},
		devtool: 'source-map'
	},
	{
		name: 'node:client',
		entry: './src/client/client-node.js',
		output: {
			filename: 'client-node.js',
			path: __dirname + '/dist',
			libraryTarget: 'commonjs2'
		},
		target: 'node',
		externals: [nodeExternal],
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loaders: ['babel-loader']
				}
			]
		},
		devtool: 'source-map'
	},
	{
		name: 'web:client',
		entry: './src/client/client-web.js',
		output: {
			filename: 'client-web.js',
			path: __dirname + '/dist',
			libraryTarget: 'commonjs2'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loaders: ['babel-loader']
				}
			]
		},
		devtool: 'source-map'
	},
	{
		name: 'web:client:globals',
		entry: './src/client/client-web.js',
		output: {
			filename: 'client-web-globals.js',
			path: __dirname + '/dist',
			library: 'LineClient',
            libraryTarget: 'var'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loaders: ['babel-loader']
				}
			]
		},
		devtool: 'source-map'
	}
]
