import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'


type WebpackConfig = webpack.Configuration & { devServer?: DevServerConfiguration }


export default (_: any, options: any): WebpackConfig => {
    const HOST = process.env.HOST ?? 'localhost'
    const PORT = parseInt(process.env.PORT ?? '3000', 10)
    const hmrDisabled = process.env.NO_HMR

    const isProduction = options.mode === 'production'
    const isDevelopment = options.mode === 'development'

    const config: WebpackConfig = {}

    /*
     * -------------------------------------------------------------
     * Entry points
     * -------------------------------------------------------------
     */

    config.entry = {
        '/index': path.resolve(__dirname, 'src/index'),
        "/donation": path.resolve(__dirname, 'src/pages/donation/index'),
        "/donation/auction": path.resolve(__dirname, 'src/pages/donation/auction/index'),
    }

    /*
     * -------------------------------------------------------------
     * Output
     * -------------------------------------------------------------
     */

    config.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    }

    /*
     * -------------------------------------------------------------
     * Optimization
     * -------------------------------------------------------------
     */

    config.optimization = isDevelopment ? {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
            },
        },
    } : {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
            },
        },
    }

    /*
     * -------------------------------------------------------------
     * Plugins
     * -------------------------------------------------------------
     */

    config.plugins = []

    if (isDevelopment && !hmrDisabled) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    config.plugins.push(
        new HtmlWebpackPlugin({
            title: 'Demtergift',
            favicon: 'public/favicon.svg',
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: 'public/index.html',
            inject: false,
        }), new HtmlWebpackPlugin({
            title: 'Demtergift',
            favicon: 'public/favicon.ico',
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: 'public/index.html',
            inject: false,
        })
        , new HtmlWebpackPlugin({
            title: 'Demtergift - Donation',
            filename: path.resolve(__dirname, 'dist/donation/index.html'),
            template: 'public/index.html',
            inject: false,
        })
        , new HtmlWebpackPlugin({
            title: 'Demtergift - Auction',
            filename: path.resolve(__dirname, 'dist/donation/auction/index.html'),
            template: 'public/index.html',
            inject: false,
        })
    )

    if (isProduction) {
        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[contenthash:6].css',
                ignoreOrder: true,
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: 'public',
                        from: 'favicon.ico',
                    },
                    {
                        context: 'public',
                        from: 'favicon.svg',
                    },
                ],
            }),
        )
    }

    /*
     * -------------------------------------------------------------
     * Module
     * -------------------------------------------------------------
     */

    config.module = {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/i,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg|woff2?)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/',
                        outputPath: 'assets/',
                        esModule: false,
                        name: '[hash:16].[ext]',
                    },
                },
            },
        ],
    }

    /*
     * -------------------------------------------------------------
     * Resolve
     * -------------------------------------------------------------
     */

    config.resolve = {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },

        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],

        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
    }

    /*
     * -------------------------------------------------------------
     * Devtool
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.devtool = 'inline-source-map'
    }

    /*
     * -------------------------------------------------------------
     * Dev Server
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.devServer = {
            host: HOST,
            port: PORT,
            contentBase: [
                path.resolve(__dirname + '/dist'),
            ],
            inline: hmrDisabled ? false : true,
            hot: hmrDisabled ? false : true,
            quiet: false,
            historyApiFallback: true,
            stats: {
                colors: true,
            },
        }
    }

    /*
     * -------------------------------------------------------------
     * Watch
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.watchOptions = {
            aggregateTimeout: 5,
            ignored: /node_modules/,
            poll: true,
        }
    }

    /*
     * -------------------------------------------------------------
     * Stats
     * -------------------------------------------------------------
     */

    config.stats = 'summary'

    return config
}
