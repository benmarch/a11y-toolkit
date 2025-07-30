const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  target: 'node',
  output: {
    library: 'a11yUtils',
    libraryTarget: 'umd',
    globalObject: 'globalThis',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [
    nodeExternals(),    
  ],
  watchOptions: {
    ignored: ['**/dist', '**/.storybook', '**/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },      
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
}
