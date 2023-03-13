const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = (env, argv) => {
  const SERVER_PATH = (argv.mode === 'production') ?
    './src/server/server-prod.js' :
    './src/server/server-dev.js'

  return ({
    resolve: {
      alias: {
        CssFolderS: path.resolve(__dirname, 'src/server/css'),
        ServerData: path.resolve(__dirname, 'src/server/data'),
        //     HtmlFolder: path.resolve(__dirname, 'src/server/html'),
        //     DataFolder: path.resolve(__dirname, 'src/server/data'),
        //     JsFolder: path.resolve(__dirname, 'src/server/js'),
        //   }
      }
    },
    entry: {
      server: SERVER_PATH,
      data: ['./src/server/data/edgelist.csv', './src/server/data/nodelist.csv'],
      datafw: ['./src/server/data/firewall.csv'],
      datacc: ['./src/server/data/edgeproblem-short.csv', './src/server/data/objectives-short.csv','./src/server/data/problems-short.csv'],
      dataxml: ['./src/server/data/cc3R4.xml'],

      // index: './src/js/initpage.js',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js',
      clean: true
    },
    // target: 'node',
    target: 'node',
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false,   // if you don't put this is, __dirname
      __filename: false,  // and __filename return blank or /
    },
    
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
      rules: [
        {
          // Transpiles ES6-8 into ES5
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }

        },
        {
          test: /\.csv$/,
          loader: 'file-loader',
          // options: {
          //     Path: 'data',
          //     emitFile: true,
          //   },
        },
        {
          test: /\.xml$/,
          loader: 'file-loader',
          // options: {
          //     Path: 'data',
          //     emitFile: true,
          //   },
        }
        // {
        //   // Loads the javacript into html template provided.
        //   // Entry point is set below in HtmlWebPackPlugin in Plugins 
        //   test: /\.html$/,
        //   use: [
        //     {
        //       loader: "html-loader",
        //       //options: { minimize: true }
        //     }
        //   ]
        // },
        // {
        //   test: /\.css$/,
        //   use: ['style-loader', 'css-loader']
        // },
      ]
    },

    
    // plugins: [
    //   new HtmlWebPackPlugin({
    //     title: "WebPage",
    //     template: "src/server/html/index.html",
    //     filename: "index.html",
    //     inject: "head",
    //     excludeChunks: ['server', 'framepage']
    //   })
    // ]
  })
}