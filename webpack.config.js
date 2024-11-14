const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/renderer/index.jsx'
    },
    target: 'electron-renderer',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        // Explicit fallbacks are not normally needed, fs, path should aim to run in electron main
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/renderer/index.html'
        })
    ],
    devServer: {
        static: path.join(__dirname, "dist"),
        port: 3000,
        hot: true,
        devMiddleware: {
            writeToDisk: true
        }
    }
};