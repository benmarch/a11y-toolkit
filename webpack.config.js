const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = (env, argv) => ({
  entry: {
    main: './src/index.ts'
  },
  target: 'node',
  output: {
    library: 'a11yToolkit',
    libraryTarget: 'umd',
    globalObject: 'globalThis',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: argv.mode === 'production' ? [
    nodeExternals(),    
  ] : [],
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
})
