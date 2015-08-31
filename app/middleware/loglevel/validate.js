'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' ),
	contains = require( 'validate.io-contains' );


// VARIABLES //

var LEVELS = [
	'trace',
	'debug',
	'info',
	'warn',
	'error',
	'fatal'
];


// VALIDATE //

/**
* FUNCTION: validate( request, response, next )
*	Validates request parameters for setting the runtime log level.
*
* @param {Object} request - HTTP request object
* @param {Object} response - HTTP response object
* @param {Function} next - callback to invoke after validating
*/
function validate( request, response, next ) {
	var query = request.body,
		msg,
		error;

	if ( !isNumber( query.level ) && !contains( LEVELS, query.level ) ) {
		msg = 'Invalid query parameter. `level` should either be numeric or one of the following strings: [' + LEVELS.join( ', ' ) + '].';
		error = {
			'status': 400,
			'message': msg
		};
		next( error );
		return;
	}
	next();
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
