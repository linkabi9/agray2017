var webpack = require('webpack');
var path = require('path');

var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
	pixi = path.join(phaserModule, 'build/custom/pixi.js'),
	p2 = path.join(phaserModule, 'build/custom/p2.js');


module.exports = {
	devtool: 'source-map',
	entry: {
		index: './index'
	},
	output: {
		filename: '[name].js',//'[name].[chunkhash].js',
		path: path.resolve('dist/')
	},
	plugins: [
		//this instance of the chunks instance collects all the common/multiple use "modules" in our code base
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
				//return true if this module is an npm package or if it's in the Sapient libs directory
				return module.context && (module.context.indexOf('node_modules') !== -1);
			}
		}),
		//because we catch every lib/vendor module with the chunks instance above the only thing left for this chunks instance to catch is the webpack manifest/wrapper engine
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		})
	],
	module: {
		loaders: [
			/* { test: require.resolve('jquery'), loader: 'expose-loader?$!expose-loader?jQuery' }, */
			{ test: /pixi\.js/, use: ['expose-loader?PIXI'] },
			{ test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
			{ test: /p2\.js/, use: ['expose-loader?p2'] },
			{ test: /\.ts?$/, loader: 'ts-loader' }

		]
	},
	resolve: {
		extensions: [".js", ".json", ".node", ".ts"],
		alias: {
			'phaser': phaser,
			'pixi': pixi,
			'p2': p2,

		}
	},
	devServer: {
		contentBase: path.join(__dirname),
		compress: true,
		port: 9000,
		inline: true,
		watchOptions: {
			aggregateTimeout: 300,
			poll: true,
			ignored: /node_modules/
		}
	},

};
