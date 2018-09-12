
const path = require('path');

const config = {
	mode: 'production',
	entry: {
		main: './src/restore-scroller.js'
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname,'dist')
	},
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
				// vue-loader options go here
				}
			},{
				test: /(\.jsx|\.js)$/,
				use: { loader: 'babel-loader' }
			},
				{test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					appendTsSuffixTo: [/\.vue$/],
				}
			}]
	}				
}

module.exports =  config;
