const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');
const NodemonPlugin = require('nodemon-webpack-plugin')

 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
     static: './dist',
   }, plugins: [new NodemonPlugin()]
 });



