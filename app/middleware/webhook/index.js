'use strict';

// MIDDLEWARE //

var parse = require( 'body-parser' ).json(),
	validate = require( './validate.js' ),
	webhook = require( './webhook.js' ),
	okay = require( './okay.js' );


// EXPORTS //

module.exports = [
	parse,
	validate,
	webhook,
	okay
];
