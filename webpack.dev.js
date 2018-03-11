const path = require('path');

module.exports = {
  entry: './src/client/keramiko/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                browsers: ['Chrome >= 64'],
              },
            }],
            '@babel/preset-react',
          ],
        },
      },
    }],
  },
  devtool: 'eval-source-map',
};
