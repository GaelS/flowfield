const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'FlowField'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'babel-preset-flow'],
            plugins: ['transform-object-rest-spread']
          }
        }
      }
    ]
  }
};
