'use strict';

// MODULES //

var parse = require( 'utils-json-parse' ),
	config = require( 'config' ),
	sign = require( './sign.js' );


// VARIABLES //

var RE = /^Github\-Hookshot\//;


// VALIDATE //

/**
* FUNCTION: validate( request, response, next )
*	Validates a Github webhook request.
*
* @param {Object} request - HTTP request object
* @param {Object} response - HTTP response object
* @param {Function} next - callback to invoke after validating
*/
function validate( request, response, next ) {
	var body = request.body,
		error,
		msg,
		sig,
		evt,
		id,
		ua;

	// Check for the presence of several Github webhook headers...
	sig = request.get( 'X-Hub-Signature' );
	if ( !sig ) {
		msg = 'invalid request. Missing X-Hub-Signature header.';
		error = {
			'status': 400,
			'message': msg
		};
		return next( error );
	}
	evt = request.get( 'X-Github-Event' );
	if ( !evt ) {
		msg = 'invalid request. Missing X-Github-Event header.';
		error = {
			'status': 400,
			'message': msg
		};
		return next( error );
	}
	id = request.get( 'X-Github-Delivery' );
	if ( !id ) {
		msg = 'invalid request. Missing X-Github-Delivery header.';
		error = {
			'status': 400,
			'message': msg
		};
		return next( error );
	}
	ua = request.get( 'User-Agent' );
	if ( !RE.test( ua ) ) {
		msg = 'invalid request. Unrecognized user agent: `' + ua + '`.';
		error = {
			'status': 400,
			'message': msg
		};
		return next( error );
	}
	// Verify the signature:
	if ( sig !== sign( config.get( 'secret' ), body ) ) {
		msg = 'invalid request. X-Hub-Signature does not match the blob signature.';
		error = {
			'status': 400,
			'message': msg
		};
		return next( error );
	}
	body = parse( body );
	if ( body instanceof Error ) {
		msg = 'invalid request. Unable to parse the request body as JSON.';
		error = {
			'status': 400,
			'message': msg
		};
		return next( error );
	}
	request.locals.event = {
		'event': evt,
		'id': id,
		'data': body
	};
	next();
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
