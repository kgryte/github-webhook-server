'use strict';

// MIDDLEWARE //

var validate = require( './validate.js' ),
	webhook = require( './webhook.js' ),
	okay = require( './okay.js' );


// EXPORTS //

module.exports = [
	validate,
	webhook,
	okay
];
