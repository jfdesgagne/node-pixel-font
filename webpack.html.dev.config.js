const path = require('path')
const defaultConfig = require('./webpack.html.config')

module.exports = {
    ...defaultConfig,
    entry: './src/__examples__/html-example.ts',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        port: 9000
    }
}