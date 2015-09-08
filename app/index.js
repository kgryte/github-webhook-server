'use strict';

// MODULES //

var express = require( 'express' ),
	bootable = require( 'bootable' ),
	config = require( 'config' ),
	logger = require( 'logger' ),
	isFunction = require( 'validate.io-function' ),
	middleware = require( './middleware' ),
	server = require( './server' ),
	validate = require( './validate.js' );


// BOOT //

/**
* FUNCTION: boot( options[, clbk] )
*	Defines the boot order for an express application. When invoked, creates and boots the application.
*
* @param {Object} options - boot options
* @param {String} options.secret - Github webhook secret
* @param {Function[]} options.hooks - hooks invoked upon receiving a webhook event
* @param {Number} [options.port=0] - server port
* @param {Number} [options.loglevel='info'] - application log level
* @param {Boolean} [options.ssl=false] - indicates whether to enable HTTPS
* @param {String} [options.key] - path to private key
* @param {String} [options.cert] - path to public certificate
* @param {Function} [clbk] - callback to invoke after successfully booting the application
* @returns {Function} express application
*/
function boot( options, clbk ) {
	var opts = {},
		app,
		err;

	if ( arguments.length > 1 ) {
		if ( !isFunction( clbk ) ) {
			throw new TypeError( 'invalid input argument. Callback must be a function. Value: `' + clbk + '`.' );
		}
	}
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	// [0] Update application settings...
	config.merge( opts );

	// [1] Set the application log level:
	logger.levels( 'main', config.get( 'logger.level' ) );

	// [2] Log the current run-time environment:
	logger.info( 'Environment configuration: %s.', config.get( 'env' ) );

	// [3] Create the application...
	app = bootable( express() );

	// [4] Bind application middleware...
	app.phase( middleware );

	// [5] Create the server...
	app.phase( server );

	// [6] Boot the application...
	app.boot( onBoot );

	return app;

	/**
	* FUNCTION: onBoot( [error] )
	*	Callback invoked after application boot sequence completion.
	*
	* @private
	* @param {Error} [error] - error object
	*/
	function onBoot( error ) {
		if ( error ) {
			logger.info({ 'error': error });
			return process.exit( -1 );
		}
		if ( clbk ) {
			clbk();
		}
	} // end FUNCTION onBoot()
} // end FUNCTION boot()


// EXPORTS //

module.exports = boot;
