const path = require('path');


 module.exports = {
   target: "node",
   entry: {
     app: './src/index.js',
   },  
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
 };