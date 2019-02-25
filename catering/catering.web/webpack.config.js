'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        'patient': './ClientApp/patient/app.js',
        'caregiver': './ClientApp/caregiver/app.js'
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'wwwroot/app'),
        publicPath: '/app/'
    },

    mode: 'development', //'production',

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
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'Popper': 'popper.js/dist/umd/popper'
        })
    ],
    
    optimization: {        
        splitChunks: {
            name: 'vendor',
            chunks: 'all'            
        }
    }
};