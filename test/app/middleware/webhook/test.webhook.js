/* global require, describe, it */
'use strict';

var mpath = './../../../../app/middleware/webhook/webhook.js';


// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	proxyquire = require( 'proxyquire' ),
	webhook = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// MOCKS //

/**
* FUNCTION: config( hook )
*	Mocks the config dependency.
*
* @private
* @param {Function} hook - mock hook
* @returns {Object} mock config
*/
function config( hook ) {
	return {
		'get': function get() {
			return [ hook ];
		}
	};
} // end FUNCTION config()


// TESTS //

describe( 'app/middleware/webhook/webhook', function tests() {

	var request,
		response,
		next;

	request = {
		'locals': {
			'event': {}
		}
	};
	response = {};
	next = noop;

	it( 'should export a function', function test() {
		expect( webhook ).to.be.a( 'function' );
	});

	it( 'should invoke a hook', function test( done ) {
		var webhook = proxyquire( mpath, {
			'config': config( hook )
		});
		webhook( request, response, next );
		function hook( error, evt ) {
			assert.isNull( error );
			assert.ok( evt );
			done();
		}
	});

	it( 'should invoke a callback when finished', function test( done ) {
		var webhook = proxyquire( mpath, {
			'config': config( noop )
		});
		webhook( request, response, clbk );
		function clbk( error ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.ok( true );
			}
			done();
		}
	});

});
