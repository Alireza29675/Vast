const fs = require('fs');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './examples/src/index.js',
    output: {
        filename: './examples/bundle.js',
        sourceMapFilename: './examples/bundle.js.map'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: { presets: ['es2015', 'react'] }
            }]
    }
};