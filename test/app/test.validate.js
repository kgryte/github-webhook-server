/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	validate = require( './../../app/validate.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'validate', function tests() {

	it( 'should export a function', function test() {
		expect( validate ).to.be.a( 'function' );
	});

	it( 'should return an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			function(){},
			[]
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( validate( {}, values[ i ] ) instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `secret` option which is not a string primitive', function test() {
		var values, err;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'secret': values[ i ],
				'hooks': [ noop ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `hooks` option which is not an array of functions', function test() {
		var values, err;

		values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'secret': '1234',
				'hooks': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `port` option which is not a nonnegative integer', function test() {
		var values, err;

		values = [
			-5,
			Math.PI,
			'5',
			undefined,
			null,
			NaN,
			true,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'secret': '1234',
				'hooks': [ noop ],
				'port': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `loglevel` option which is not either a number primitive or a recognized log level', function test() {
		var values, err;

		values = [
			'5',
			'beep',
			'boop',
			'',
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'secret': '1234',
				'hooks': [ noop ],
				'loglevel': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided an `ssl` option which is not a boolean primitive', function test() {
		var values, err;

		values = [
			5,
			'5',
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'secret': '1234',
				'hooks': [ noop ],
				'ssl': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `key` option which is not a string primitive', function test() {
		var values, err;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'secret': '1234',
				'hooks': [ noop ],
				'ssl': true,
				'key': values[ i ],
				'cert': 'beep'
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `cert` option which is not a string primitive', function test() {
		var values, err;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'secret': '1234',
				'hooks': [ noop ],
				'ssl': true,
				'key': 'beep',
				'cert': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return null if all options are valid', function test() {
		var err;

		err = validate( {}, {
			'secret': '1234',
			'hooks': [ noop ],
			'port': 7331,
			'loglevel': 'debug',
			'ssl': true,
			'key': 'beep',
			'cert': 'boop'
		});

		assert.isNull( err );

		err = validate( {}, {
			'secret': '1234',
			'hooks': [ noop ],
			'ssl': false,
			'beep': true, // misc options
			'boop': 'bop'
		});

		assert.isNull( err );
	});

});
