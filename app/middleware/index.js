'use strict';

// MIDDLEWARE //

var compression = require( 'compression' ),
	responseTime = require( 'response-time' ),
	logger = require( 'logger' ),
	start = require( './start' ),
	finish = require( './finish' ),
	onError = require( './error' );


// REQUEST HANDLERS //

var loglevel = require( 'express-router-bunyan-loglevel' ),
	status = require( 'express-router-status' ),
	monitor = require( './monitor' ),
	webhook = require( './webhook' );


// MIDDLEWARE //

/**
* FUNCTION: middleware( clbk )
*	Binds application middleware.
*
* @param {Function} clbk - callback to run after binding middleware
*/
function middleware( next ) {
	/* jshint validthis:true */
	var app = this;

	/**
	* Middleware.
	*/

	// Append the response time to response headers:
	app.use( responseTime({
		'digits': 6,
		'header': 'X-Response-Time',
		'suffix': true // ms
	}));

	// Compress any requests and responses:
	app.use( compression() );

	// Perform initial start tasks:
	app.use( start );

	// Disable `X-Powered-By` header:
	app.disable( 'x-powered-by' );


	/**
	* Routes.
	*/

	app.use( '/', loglevel( logger ) );

	app.use( '/', status );

	app.get( '/monitor', monitor );

	app.post( '/webhook', webhook );


	/**
	* Middleware.
	*/

	// Perform finishing tasks:
	app.use( finish );

	// Generic error handling:
	app.use( onError );


	/**
	* Done.
	*/

	next();
} // end FUNCTION middleware()


// EXPORTS //

module.exports = middleware;
