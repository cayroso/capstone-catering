'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        'customer': './ClientApp/customer/app.js',
        'administrator': './ClientApp/administrator/app.js'
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'wwwroot/app'),
        publicPath: '/app/'
    },

    mode: 'development', //'production',development

    module: {
        rules: [
            {
                test: /\.css$/,// loader: 'style-loader!css-loader'
                use: [
                    //{ loader: 'style-loader' },
                    { loader: MiniCssExtractPlugin.loader, options: { module: true } },
                    { loader: 'css-loader'},
                    //{ loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]',
                options: {
                    publicPath: './'
                }
            }
        ]
    },
    plugins: [        
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name]-bundle.css'
        }),
        new webpack.ProvidePlugin({
            'jQuery': 'jquery',
            'window.$': 'jquery',            
            'window.jQuery': 'jquery',
            'Popper': 'popper.js/dist/umd/popper',
            //'jQuery.fullCalendar': 'fullcalendar/dist/fullcalendar'
        })
    ],
    
    optimization: {        
        splitChunks: {
            name: 'vendor',
            chunks: 'all'            
        }
    }
};