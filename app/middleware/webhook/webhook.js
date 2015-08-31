'use strict';

// MODULES //

var config = require( 'config' );


// WEBHOOK //

/**
* FUNCTION: webhook( request, response, next )
*	Processes a webhook event.
*
* @param {Object} request - HTTP request object
* @param {Object} response - HTTP response object
* @param {Function} next - callback to invoke after processing
*/
function webhook( request, response, next ) {
	var hooks = config.get( 'hooks' ),
		len = hooks.length,
		evt,
		i;

	evt = request.locals.event;
	for ( i = 0; i < len; i++ ) {
		hooks[ i ]( null, evt );
	}
	next();
} // end FUNCTION webhook()


// EXPORTS //

module.exports = webhook;
