/* global require, describe, it, beforeEach */
'use strict';

var mpath = './../../../../app/middleware/webhook/okay.js';


// MODULES //

var chai = require( 'chai' ),
	okay = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'app/middleware/webhook/okay', function tests() {

	// SETUP //

	var request, response, next;

	request = {};
	response = {
		sendStatus: function( status ) {
			response._status = status;
			return this;
		}
	};
	next = function(){};

	beforeEach( function() {
		response._status = null;
		response.body = null;
	});

	// TESTS //

	it( 'should export a function', function test() {
		expect( okay ).to.be.a( 'function' );
	});

	it( 'should return a 204 status', function test() {
		okay( request, response, next );
		assert.strictEqual( response._status, 204 );
	});

	it( 'should invoke a callback after sending the response', function test( done ) {
		next = function next() {
			assert.ok( true );
			done();
		};
		okay( request, response, next );
	});

});
