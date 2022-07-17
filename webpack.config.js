const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: './src/javascripts/main.js',
    week12: './src/javascripts/week12.js',
    week11: './src/javascripts/week11.js',
    week10: './src/javascripts/week10.js',
    week09: './src/javascripts/week09.js',
    week08: './src/javascripts/week08.js',
    week07: './src/javascripts/week07.js',
    week06: './src/javascripts/week06.js',
    week05: './src/javascripts/week05.js',
    week03: './src/javascripts/week03.js',
    week02: './src/javascripts/week02.js',
    week01: './src/javascripts/week01.js'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'javascripts/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] }
      }, {
        test: /\.glsl$/,
        use: 'raw-loader'
      }, {
        test: /\.css$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }, {
        test: /\.scss$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }, {
        test: /\.(html|json|txt|dat|gif|jpg|png|svg|eot|ttf|woff|woff2)$/i,
        use: [{
          loader: 'file-loader',
          options: { 
            name: '[name].[ext]',
            outputPath: (url, resourcePath, context) => {
              return resourcePath.includes(`${path.sep}images${path.sep}`) ? `images/${url}` : url
            }
          }
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/main.css',
    })
  ]
};