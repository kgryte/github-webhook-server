'use strict';

// MODULES //

var fs = require( 'fs' ),
	path = require( 'path' ),
	https = require( 'https' ),
	onError = require( './onError.js' );


// VARIABLES //

var cwd = process.cwd();


// HTTPS SERVER //

/**
* FUNCTION: httpsServer( app, opts )
*	Creates an HTTPS server.

* @param {Function} app - application
* @param {Object} opts - server options
* @returns {Server} HTTPS server
*/
function httpsServer( app, options ) {
	var opts = {},
		filepath,
		err;

	// TODO: generalize for additional HTTPS options...
	// TODO: add options in JSDoc above

	// Get the private key for SSL...
	filepath = path.resolve( cwd, options.key );
	if ( !fs.existsSync( filepath ) ) {
		err = new Error( 'unable to find private key for SSL. Path: `' + options.key + '`.' );
		return onError( err );
	}
	opts.key = fs.readFileSync( filepath, 'utf8' );

	// Get the public certificate for SSL...
	filepath = path.resolve( cwd, options.cert );
	if ( !fs.existsSync( filepath ) ) {
		err = new Error( 'unable to find public certificate for SSL. Path: `' + options.cert + '`.' );
		return onError( err );
	}
	opts.cert = fs.readFileSync( filepath, 'utf8' );

	// Create the HTTPS server:
	return https.createServer( opts, app );
} // end FUNCTION httpsServer()


// EXPORTS //

module.exports = httpsServer;
