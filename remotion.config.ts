/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import {Config} from '@remotion/cli/config';
import {webpackOverride} from './src/webpack-override';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setShouldOpenBrowser(false);

// Decrease render quality for test renders
Config.setScale(0.3);
Config.setJpegQuality(40);
Config.setFrameRange([0, 900]);

Config.overrideWebpackConfig(webpackOverride);
