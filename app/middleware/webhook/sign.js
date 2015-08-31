'use strict';

// MODULES //

var crypto = require( 'crypto' );


// SIGN //

/**
* FUNCTION: sign( key, blob )
*	Signs a request blob.
*
* @param {String} key - key used to sign the blob
* @param {String} blob - blob to be signed
* @returns {String} signed blob
*/
function sign( key, blob ) {
	var hmac = crypto.createHmac( 'sha1', key );
	hmac.update( new Buffer( blob ) );
	blob = hmac.digest( 'hex' );
	return blob.toString();
} // end FUNCTION sign()


// EXPORTS //

module.exports = sign;
