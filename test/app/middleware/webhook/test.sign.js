/* global require, describe, it */
'use strict';

var mpath = './../../../../app/middleware/webhook/sign';


// MODULES //

var chai = require( 'chai' ),
	sign = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'app/middleware/webhook/sign', function tests() {

	it( 'should export a function', function test() {
		expect( sign ).to.be.a( 'function' );
	});

	it( 'should return a string', function test() {
		assert.isString( sign( '1234', '{"beep":"boop"}' ) );
	});

});
