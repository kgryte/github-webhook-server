/* global require, describe, it, beforeEach */
'use strict';

var mpath = './../../app';


// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	proxyquire = require( 'proxyquire' ),
	createApp = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'app', function tests() {

	var opts;

	beforeEach( function beforeEach() {
		opts = {
			'secret': '1234',
			'hooks': [ noop ]
		};
	});

	it( 'should export a function to create an application', function test() {
		expect( createApp ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided options', function test() {
		expect( foo ).to.throw( TypeError );
		function foo() {
			createApp();
		}
	});

	it( 'should throw an error if provided a callback which is not a function', function test() {
		var values = [
			'5',
			5,
			NaN,
			null,
			undefined,
			true,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				createApp( opts, value );
			};
		}
	});

	it( 'should throw an error if not provided a webhook secret', function test() {
		expect( foo ).to.throw( TypeError );
		function foo() {
			createApp({
				'hooks': [ noop ]
			});
		}
	});

	it( 'should throw an error if not provided hooks', function test() {
		expect( foo ).to.throw( TypeError );
		function foo() {
			createApp({
				'secret': '1234'
			});
		}
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			NaN,
			null,
			undefined,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				opts.ssl = value;
				createApp( opts, noop );
			};
		}
	});

	it( 'should return an application', function test( done ) {
		var app = createApp( opts );
		expect( app ).to.be.a( 'function' );
		setTimeout( onTimeout, 200 );
		function onTimeout() {
			app.server.close();
			assert.ok( true );
			done();
		}
	});

	it( 'should invoke a provided callback upon successful application creation', function test( done ) {
		var app = createApp( opts, onApp );
		function onApp() {
			app.server.close();
			assert.ok( true );
			done();
		}
	});

	it( 'should append routes during application creation', function test( done ) {
		var app = createApp( opts, onApp );
		function onApp() {
			app.server.close();
			assert.ok( Object.keys( app._router.stack ).length );
			done();
		}
	});

	it( 'should exit the process if errors are encountered during the boot process', function test( done ) {
		var fcn, createApp;

		fcn = process.exit;
		process.exit = function onExit() {
			assert.ok( true, 'process failed to exit' );
			process.exit = fcn;
			done();
		};

		createApp = proxyquire( mpath, {
			'bootable': bootable
		});
		createApp( opts );

		function bootable() {
			return {
				'phase': function phase() {},
				'boot': function boot( clbk ) {
					clbk( new Error( 'error' ) );
				}
			};
		}
	});

});
