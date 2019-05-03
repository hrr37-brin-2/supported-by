const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');
module.exports = {
  entry: `${__dirname}/client/src/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/client/dist`
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : `${__dirname}/client/src`,
        loader : 'babel-loader'
      }
    ]
  },
plugins: [
    new BrotliGzipPlugin({
        asset: '[path].br[query]',
        algorithm: 'brotli',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        quality: 11
    }),
    new BrotliGzipPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
    })
  ]
};
