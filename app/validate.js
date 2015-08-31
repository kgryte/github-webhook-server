'use strict';

// MODULES //

var isObject = require( 'validate.io-object' ),
	contains = require( 'validate.io-contains' ),
	isString = require( 'validate.io-string-primitive' ),
	isNumber = require( 'validate.io-number-primitive' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	isFunctionArray = require( 'validate.io-function-array' ),
	isNonNegativeInteger = require( 'validate.io-nonnegative-integer' );


// VARIABLES //

var LEVELS = [
	'trace',
	'debug',
	'info',
	'warn',
	'error',
	'fatal'
];


// VALDIATE //

/**
* FUNCTION: validate( opts, options )
*	Validates application options.
*
* @param {Object} opts - destination object
* @param {Object} options - application options
* @param {String} options.secret - Github webhook secret
* @param {Function[]} options.hooks - hooks invoked upon receiving a webhook event
* @param {Number} [options.port] - server port
* @param {Number} [options.loglevel] - application log level
* @param {Boolean} [options.ssl] - indicates whether to enable HTTPS
* @param {String} [options.key] - path to SSL key
* @param {String} [options.cert] - path to SSL certificate
* @returns {Null|Error} null or an error object
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options must be an object. Value: `' + options + '`.' );
	}
	opts.secret = options.secret;
	if ( !isString( opts.secret ) ) {
		return new TypeError( 'invalid option. Webhook secret must be a string primitive. Option: `' + opts.secret + '`.' );
	}
	opts.hooks = options.hooks;
	if ( !isFunctionArray( opts.hooks ) ) {
		return new TypeError( 'invalid option. Hooks option must be an array of functions. Option: `' + opts.hooks + '`.' );
	}
	if ( options.hasOwnProperty( 'port' ) ) {
		opts.port = options.port;
		if ( !isNonNegativeInteger( opts.port ) ) {
			return new TypeError( 'invalid option. Port option must be a nonnegative integer. Option: `' + opts.port + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'loglevel' ) ) {
		opts.logger = {};
		opts.logger.level = options.loglevel;
		if (
			!isNumber( options.loglevel ) &&
			!contains( LEVELS, options.loglevel )
		) {
			return new TypeError( 'invalid option. Log level option must either be a recognized log level or a number primitive. Option: `' + options.loglevel + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'ssl' ) ) {
		opts.ssl = {};
		opts.ssl.enabled = options.ssl;
		if ( !isBoolean( options.ssl ) ) {
			return new TypeError( 'invalid option. SSL option must be a boolean primitive. Option: `' + options.ssl + '`.' );
		}
		if ( options.ssl ) {
			opts.ssl.key = options.key;
			if ( !isString( options.key ) ) {
				return new TypeError( 'invalid option. Key option must be a string primitive. Option: `' + options.key + '`.' );
			}
			opts.ssl.cert = options.cert;
			if ( !isString( options.cert ) ) {
				return new TypeError( 'invalid option. Certificate option must be a string primitive. Option: `' + options.cert + '`.' );
			}
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
