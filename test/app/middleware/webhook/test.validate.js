/* global require, describe, it, beforeEach */
'use strict';

var mpath = './../../../../app/middleware/webhook/validate.js';


// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	proxyquire = require( 'proxyquire' ),
	validate = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// MOCKS //

var config = {
	'get': function get() {
		return '5678';
	}
};


// TESTS //

describe( 'app/middleware/webhook/validate', function tests() {

	// SETUP //

	var request, response, next;

	request = {
		'headers': {},
		'get': function get( header ) {
			return request.headers[ header ];
		},
		'body': '',
		'locals': {}
	};
	response = {};

	beforeEach( function beforeEach() {
		request.headers = {
			'X-Hub-Signature': '351e7d1c8d0e0d84c395a919e173c526d22c8dc9',
			'X-Github-Event': 'issues',
			'X-Github-Delivery': '72d3162e-cc78-11e3-81ab-4c9367dc0958',
			'User-Agent': 'Github-Hookshot/044aadd'
		};
		request.body = '{"beep":"boop"}';
		request.locals = {};
		next = noop;
	});


	// TESTS //

	it( 'should export a function', function test() {
		expect( validate ).to.be.a( 'function' );
	});

	it( 'should return an error if a request does not have an `X-Hub-Signature` header', function test( done ) {
		next = function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		};

		delete request.headers[ 'X-Hub-Signature' ];
		validate( request, response, next );
	});

	it( 'should return an error if a request does not have an `X-Github-Event` header', function test( done ) {
		next = function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		};

		delete request.headers[ 'X-Github-Event' ];
		validate( request, response, next );
	});

	it( 'should return an error if a request does not have an `X-Github-Delivery` header', function test( done ) {
		next = function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		};

		delete request.headers[ 'X-Github-Delivery' ];
		validate( request, response, next );
	});

	it( 'should return an error if a request has an unrecognized `User-Agent` header', function test( done ) {
		next = function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		};

		request.headers[ 'User-Agent' ] = 'BeepBoop';
		validate( request, response, next );
	});

	it( 'should return an error if unable to verify the signature', function test( done ) {
		var validate = proxyquire( mpath, {
			'config': config
		});
		next = function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		};
		validate( request, response, next );
	});

	it( 'should return an error if unable to parse the request body as JSON', function test( done ) {
		next = function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		};
		request.headers[ 'X-Hub-Signature' ] = 'fdad86b89d502aced775f9111cffec66f875cccb';
		request.body = '{beep":"boop"}';
		validate( request, response, next );
	});

	it( 'should append an event object to a `locals` object', function test() {
		assert.deepEqual( request.locals, {} );
		validate( request, response, next );
		assert.property( request.locals, 'event' );
	});

	it( 'should invoke a callback after successfully validating', function test( done ) {
		next = function next( error ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.ok( true );
			}
			done();
		};
		validate( request, response, next );
	});

});
