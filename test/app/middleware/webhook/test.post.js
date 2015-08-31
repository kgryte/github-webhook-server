/* global require, describe, it */
'use strict';

var mpath = './../../../../app/middleware/webhook';


// MODULES //

var chai = require( 'chai' ),
	mw = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'app/middleware/webhook/post', function tests() {

	it( 'should export an array of middleware', function test() {
		expect( mw ).to.be.an( 'array' );
	});

});
