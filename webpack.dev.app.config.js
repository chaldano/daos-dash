const path = require("path")
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  resolve: {
    alias: {
      CssFolder: path.resolve(__dirname, 'src/app/css'),
      HtmlFolder: path.resolve(__dirname, 'src/app/html'),
      // DataFolder: path.resolve(__dirname, 'src/app/data'),
      JsFolder: path.resolve(__dirname, 'src/app/js'),
      TkbbFolder: path.resolve(__dirname, 'src/app/tkbb'),
    
    }
  },
  entry: {
    app: './src/app/js/index.js',
    // app:['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/app/js/index.js'],
    homepage: './src/app/tkbb/homepage.js',
    // homepage: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000, ./src/app/tkbb/homepage.js'],
    // data:['./src/app/data/edgelist.csv', './src/app/data/nodelist.csv'],
    
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'auto',
    filename: '[name].js'
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: require.resolve('jquery'),
        jQuery: require.resolve('jquery')
    }),
    new HtmlWebPackPlugin({
      title: "WebPage",
      template: "src/app/html/index.html",
      filename: "index.html",
      inject: "head",
      excludeChunks: ['server']
    }),
    new MiniCssExtractPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
}