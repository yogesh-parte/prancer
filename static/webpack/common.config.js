const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const merge = require('webpack-merge');

const development = require('./dev.config');
const production = require('./prod.config');

require('babel-polyfill').default;

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, '../src'),
    build: path.join(__dirname, '../dist'),
};

process.env.BABEL_ENV = TARGET;

const common = {
    entry: [
      'babel-polyfill',
        PATHS.app,
    ],

    output: {
        path: PATHS.build,
        filename: 'bundle.js',
    },

    externals: {
      fs: require('fs'),
    },

    resolve: {
        extensions: ['', '.jsx', '.js', '.ts', '.tsx', '.json', '.scss'],
        modulesDirectories: ['node_modules', PATHS.app],
    },

    module: {
        loaders: [{
            test: /bootstrap-sass\/assets\/javascripts\//,
            loader: 'imports?jQuery=jquery',
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff',
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff2',
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/octet-stream',
        }, {
            test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-otf',
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file',
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=image/svg+xml',
        }, {
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
            // include: __dirname,
        },
        {
            test: /\.ts|\.tsx$/,
            loaders: ['babel-loader', 'ts-loader'],
            // include: __dirname,
        }, {
            test: /\.png$/,
            loader: 'file?name=[name].[ext]',
        }, {
            test: /\.jpg$/,
            loader: 'file?name=[name].[ext]',
        }],
    },

    postcss: (webpack) => (
        [
            autoprefixer({
                browsers: ['last 2 versions'],
            }),
            postcssImport({
                addDependencyTo: webpack,
            }),
        ]
    ),
};

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(development, common);
}

if (TARGET === 'build' || !TARGET) {
    module.exports = merge(production, common);
}
