'use strict';

/**
* FUNCTION: hook( error, evt )
*	Hook invoked whenever a Github webhook receives an event.
*
* @param {Error|Null} error - error object
* @param {Object} evt - hook event
*/
function hook( error, evt ) {
	if ( error ) {
		throw error;
	}
	console.log( evt );
} // end FUNCTION hook()


// EXPORTS //

module.exports = hook;
