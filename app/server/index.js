'use strict';

// MODULES //

var config = require( 'config' ),
	logger = require( 'logger' ),
	httpServer = require( './http.js' ),
	httpsServer = require( './https.js' ),
	onError = require( './onError.js' );


// CREATE SERVER //

/**
* FUNCTION: create( next )
*	Creates an HTTP/S server.
*
* @param {Function} next - callback to run after initializing the server
*/
function create( next ) {
	/* jshint validthis:true */
	var server,
		port,
		ssl;

	// Get server configuration settings...
	port = config.get( 'port' );
	ssl = config.get( 'ssl' );

	// Determine if we need to create a basic or secure HTTP server...
	if ( ssl.enabled ) {
		server = httpsServer( this, ssl );
	} else {
		server = httpServer( this );
	}
	server.on( 'error', onError );

	// Begin listening for HTTP requests...
	server.listen( port, onListen );

	// Expose the server to the application:
	this.server = server;

	/**
	* FUNCTION: onListen()
	*	Callback invoked once a server is listening and ready to handle requests.
	*
	* @private
	*/
	function onListen() {
		logger.info( ( ( ssl.enabled ) ? 'HTTPS' : 'HTTP' ) + ' server initialized. Server is listening for requests on port: ' + server.address().port + '.' );
		next();
	} // end FUNCTION onListen()
} // end FUNCTION create()


// EXPORTS //

module.exports = create;
