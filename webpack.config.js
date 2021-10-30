'use strict';

const path = require('path');
const base = path.resolve(path.dirname(__dirname));
const AssetsManifest = require('webpack-assets-manifest');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TinypngPlugin = require('tinypng-plugin-webpack-full-featured');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

module.exports = (env, options) => {
	return {
		entry: base + '/_build/assets/js/index.js',
		output: {
			path: base + '/assets/components/app/',
			publicPath: '/assets/components/app/',
			chunkFilename: options.mode == 'production'
				? 'js/[name].[contenthash:8].bundle.js'
				: 'js/[name].js',
			filename: options.mode == 'production'
				? 'js/[name].[contenthash:8].bundle.js'
				: 'js/[name].js',
		},
		optimization: {
			minimize: options.mode == 'production',
			minimizer: [
				new TerserJSPlugin({}),
				new OptimizeCSSAssetsPlugin({}),
			],
			splitChunks: {
				chunks: options.mode == 'production'
					? 'all'
					: 'async',
				maxInitialRequests: Infinity,
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						reuseExistingChunk: true,
						name(module) {
							const packageName = module.context.match(
								/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

							return packageName.replace('@', '');
						},
					},
				},
			},
		},
		watchOptions: {
			ignored: /node_modules/,
		},
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: options.mode !== 'production',
							},
						},
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								plugins() {
									return [
										require('precss'),
										require('autoprefixer'),
									];
								},
							},
						},
						'sass-loader',
					],
				}, {
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
				}, {
					test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
					loader: 'file-loader',
					options: {
						outputPath: (url, resourcePath) => {
							return /fonts/.test(resourcePath)
								? `fonts/${url}`
								: `images/${url}`;
						},
						name: options.mode == 'production'
							? '[name].[contenthash:8].[ext]'
							: '[name].[ext]',
					},
				}],
		},
		plugins: [
			new ExtraWatchWebpackPlugin({
				dirs: [base + '/core/components/app/elements/'],
			}),
			new CleanWebpackPlugin({
				verbose: false,
				cleanStaleWebpackAssets: true,
				cleanAfterEveryBuildPatterns: [base + '../../../core/cache/*'],
				dangerouslyAllowCleanPatternsOutsideProject: true,
				dry: false,
			}),
			new AssetsManifest({
				output: base + '/assets/components/app/manifest.json',
				publicPath: true,
			}),
			new TinypngPlugin({
				from: base + '/_build/assets/images',
				extentions: ['png', 'jpeg', 'jpg'],
				silent: false,
				cache: true,
				cacheLocation: base + '/_build/assets/tinypng_cache',
				disable: options.mode !== 'production',
			}),
			new CopyPlugin([
				{
					from: base + '/_build/assets/images/',
					to: base + '/assets/components/app/images/',
				}]),
			new MiniCssExtractPlugin({
				path: base + '/assets/components/app/css/',
				publicPath: '/assets/components/app/css/',
				chunkFilename: options.mode == 'production'
					? 'css/[name].[contenthash:8].min.css'
					: 'css/[name].css',
				filename: options.mode == 'production'
					? 'css/[name].[contenthash:8].min.css'
					: 'css/[name].css',
			}),
		],
	};
};
