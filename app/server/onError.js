'use strict';

// MODULES //

var logger = require( 'logger' );


// ON ERROR //

/**
* FUNCTION: onError( error )
*	Server error event handler.
*
* @param {Error} error - server error
*/
function onError( error ) {
	if ( error.code === 'EADDRINUSE' ) {
		logger.info( 'Server address already in use.' );
	}
	logger.info({ 'error': error });
	throw error;
} // end FUNCTION onError()


// EXPORTS //

module.exports = onError;
