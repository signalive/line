const path = require('path');
const nodeExternals = require('webpack-node-externals');

const nodeExternal = nodeExternals({});

// The es5 target keeps the web bundles (and webpack's own runtime helpers)
// parseable by the old devices the player runs on; do not drop it.
function bundle(name, entry, filename, extra) {
    return Object.assign({
        name: name,
        entry: entry,
        output: Object.assign({
            filename: filename,
            path: path.resolve(__dirname, 'dist')
        }, extra.output),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: ['babel-loader']
                }
            ]
        },
        devtool: 'source-map'
    }, extra.top);
}

module.exports = [
    bundle('node:server', './src/server/server.js', 'server.js', {
        output: {library: {type: 'commonjs2'}},
        top: {target: 'node', externals: [nodeExternal, {uws: 'uws'}]}
    }),
    bundle('node:client', './src/client/client-node.js', 'client-node.js', {
        output: {library: {type: 'commonjs2'}},
        top: {target: 'node', externals: [nodeExternal]}
    }),
    bundle('web:client', './src/client/client-web.js', 'client-web.js', {
        output: {library: {type: 'commonjs2'}},
        top: {target: ['web', 'es5']}
    }),
    bundle('web:client:globals', './src/client/client-web.js', 'client-web-globals.js', {
        output: {library: {name: 'LineClient', type: 'var'}},
        top: {target: ['web', 'es5']}
    })
];
