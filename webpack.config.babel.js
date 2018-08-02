import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import nodeExternals from 'webpack-node-externals';

const common = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        query: {
          presets: [
            'env',
            'stage-2',
            'react'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "styles.css",
      chunkFilename: "[id].css"
    })
  ]
}

const clientConfig = {
  ...common,

  name: 'client',
  target: 'web',

  entry: {
    client: [
      'babel-polyfill',
      './src/app/client.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  devtool: 'cheap-module-source-map',

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
}

const serverConfig = {
  ...common,

  name: 'server',
  target: 'node',
  externals: [nodeExternals()],

  entry: {
    server: ['babel-polyfill', path.resolve(__dirname, 'src/server', 'server.js')]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },

  devtool: 'cheap-module-source-map',

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  }
}

export default [clientConfig, serverConfig];