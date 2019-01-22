const path = require('path');
const webpack = require('webpack');
const getPath = str => path.resolve(__dirname, str);
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const RemoveStrictPlugin = require('remove-strict-webpack-plugin');

module.exports = (env, argv) => {
	const isProd = argv.mode.toLowerCase() === 'production';
	const config = {
		entry  : {
			site: './src/frontend/frontend.js'
		},
		output : {
			path    : getPath('public/assets'),
			filename: '[name].js'
		},
		resolve: {
			extensions: ['.js', '.vue'],
			alias     : {
				'vue$'  : 'vue/dist/vue.esm.js',
				'public': getPath('./public')
			}
		},
		module : {
			rules: [
				{
					test   : /\.vue$/,
					loader : 'vue-loader',
					options: {
						loaders: {
							'js'  : 'babel-loader',
							'scss': 'vue-style-loader!css-loader!sass-loader',
							'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
						}
					}
				}, {
					test   : /\.js$/,
					use    : {
						loader : 'babel-loader',
						options: {
							plugins: [["module:fast-async", {
								"compiler": {
									"promises"  : true,
									"generators": false
								}
							}]],
							presets: [[
								"@babel/env",
								{"exclude": ["transform-regenerator", "transform-async-to-generator"]}
							]]
						}
					},
					exclude: /node_modules\/(?!(osmium-tools|osmium-events|osmium-webapi)\/).*/
				}, {
					test  : /\.pug$/,
					loader: ['pug-plain-loader']
				}, {
					test: /\.(css|scss|sass)$/,
					use : [
						MiniCssExtractPlugin.loader,
						{loader: 'css-loader', options: {sourceMap: true, importLoaders: 1}},
						{
							loader: 'postcss-loader', options: {
								ident: 'postcss', plugins: () => [
									postcssPresetEnv(),
									require('autoprefixer'),
									require('cssnano')]
							}
						},
						{loader: 'sass-loader', options: {sourceMap: true}}
					]
				},
				{
					test: /\.(ttf|eot|woff|woff2)$/,
					use : {
						loader : "file-loader",
						options: {
							name      : "/assets/fonts/[name].[ext]",
							outputPath: '../../'
						}
					}
				}

			]
		},
		plugins: [
			new VueLoaderPlugin(),
			require('autoprefixer'),
			new webpack.ProvidePlugin({
				$     : 'jquery',
				jQuery: 'jquery'
			}),
			new CleanWebpackPlugin('public/assets', {}),
			new MiniCssExtractPlugin({
				filename     : '[name].css',
				chunkFilename: '[id].css'
			})
		]
	};

	if (isProd) {
		config.optimization = {
			minimize : true,
			minimizer: [
				new UglifyJsPlugin({
					sourceMap    : false,
					exclude      : [/(node_modules)/],
					uglifyOptions: {
						mangle  : false,
						warnings: false,
						compress: {
							warnings: false
						},
						output  : {
							comments: false
						},
						parallel: 1
					}
				})
			]
		};
		config.plugins = (config.plugins || []).concat([
			new RemoveStrictPlugin(),
			new webpack.DefinePlugin({
				'process.env': {NODE_ENV: '"production"'}
			}),
			new webpack.LoaderOptionsPlugin({minimize: true})
		]);

	}

	return config;
};