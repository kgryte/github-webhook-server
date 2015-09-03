'use strict';

// MODULES //

var http = require( 'http' );


// HTTP SERVER //

/**
* FUNCTION: httpServer( app )
*	Creates an HTTP server.
*
* @param {Function} app - application
* @returns {Server} HTTP server
*/
function httpServer( app ) {
	return http.createServer( app );
} // end FUNCTION httpServer()


// EXPORTS //

module.exports = httpServer;
