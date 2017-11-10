const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  module: {
  	rules: [{
	  	test: /\.js$/,
	  	use: [{
	  		loader: 'babel-loader',
	  		options: {
	  			presets: ['es2015']
	  		}
	  	}]
	  }, {
	  	test: /\.sass/,
	  	use: [{
	  		loader: 'style-loader'
	  	}, {
	  		loader: 'css-loader'
	  	}, {
	  		loader: 'sass-loader'
	  	}]
	  }]
  }
};