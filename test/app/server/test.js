/* global require, describe, it */
'use strict';

var mpath = './../../../app/server';


// MODULES //

var chai = require( 'chai' ),
	path = require( 'path' ),
	noop = require( '@kgryte/noop' ),
	proxyquire = require( 'proxyquire' ),
	createServer = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// MOCKS //

var keypath, certpath;

keypath = path.resolve( __dirname, '../../fixtures/agent2-key.pem' );
certpath = path.resolve( __dirname, '../../fixtures/agent2-cert.pem' );

/**
* FUNCTION: config( bool )
*	Mocks the config dependency.
*
* @private
* @param {Boolean} bool - boolean indicating whether SSL is enabled
* @returns {Object} mock config
*/
function config( bool ) {
	return {
		'get': function get( key ) {
			if ( key === 'port' ) {
				return 0;
			}
			if ( key === 'ssl' ) {
				return {
					'enabled': bool,
					'key': keypath,
					'cert': certpath
				};
			}
		}
	};
} // end FUNCTION config()


// TESTS //

describe( 'app/server', function tests() {

	it( 'should export a function', function test() {
		expect( createServer ).to.be.a( 'function' );
	});

	it( 'should create an HTTP server', function test( done ) {
		var createServer;

		createServer = proxyquire( mpath, {
			'config': config( false )
		});

		createServer.call( app, next );

		function app() {}

		function next() {
			assert.ok( app.server.address().port );
			app.server.close();
			done();
		}
	});

	it( 'should create an HTTPS server', function test( done ) {
		var createServer;

		createServer = proxyquire( mpath, {
			'config': config( true )
		});

		createServer.call( app, next );

		function app() {}

		function next() {
			assert.ok( app.server.address().port );
			app.server.close();
			done();
		}
	});

	it( 'should throw an error if unable to find a private key for SSL', function test() {
		var createServer,
			kpath;

		kpath = keypath;
		keypath = 'dfajdlfjadljfldsaj';

		createServer = proxyquire( mpath, {
			'config': config( true )
		});

		expect( foo ).to.throw( Error );
		keypath = kpath;

		function foo() {
			createServer.call( noop, noop );
		}
	});

	it( 'should throw an error if unable to find a public certificate for SSL', function test() {
		var createServer,
			cpath;

		cpath = certpath;
		certpath = 'dfajdlfjadljfldsaj';

		createServer = proxyquire( mpath, {
			'config': config( true )
		});

		expect( foo ).to.throw( Error );
		certpath = cpath;

		function foo() {
			createServer.call( noop, noop );
		}
	});

	it( 'should throw an error if the server port is already in use', function test( done ) {
		var err;

		createServer.call( app, next );

		function app() {}

		function next() {
			expect( foo ).to.throw( Error );
			done();
		}

		function foo() {
			err = new Error( 'Server address already in use.' );
			err.code = 'EADDRINUSE';

			app.server.emit( 'error', err );
		}
	});

});
