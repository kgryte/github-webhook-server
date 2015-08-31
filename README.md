Github Webhook Server
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Github webhook server.

1. [Installation](#installation)
1. [Quick Start](#quick-start)
1. [Usage](#usage)
1. [Routes](#routes)
	-	[/monitor](#monitor-get)
	-	[/loglevel](#loglevel-put)
1. [Tests](#tests)
	-	[Unit](#unit)
	-	[Coverage](#test-coverage)
1. [License](license)


## Installation

``` bash
$ git clone https://github.com/kgryte/github-webhook-server.git
```

The application runs on [Node.js](https://nodejs.org/). Before running the application, install [dependencies](https://www.npmjs.org/) by executing the following command

``` bash
$ make install
```



## Quick Start

To start the application server

``` bash
$ npm start -- --secret <secret> --hook <module>
```

or, alternatively, from the top-level application directory

``` bash
$ node ./bin/cli --secret <secret> --hook <module>  | ./node_modules/.bin/bunyan
```

The default server `port` is `0`, in which case the port is [randomly assigned](https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback) at run-time. To determine the run-time `port`, see the log output; e.g.,

``` bash
[2015-04-18T00:08:30.331Z]  INFO: github-webhook-server/13972 on local: Environment configuration: dev.
[2015-04-18T00:08:30.340Z]  INFO: github-webhook-server/13972 on local: HTTP server initialized. Server is listening for requests on port: 59333.
```

To view the application in your local web browser, navigate to

```
http://127.0.0.1:<port>
```

For advanced usage, see [below](#usage).


## Usage

``` bash
Usage: github-webhook-server --secret <secret> --hook <module> [options]

Options:

  -h,    --help                Print this message.
  -V,    --version             Print the package version.
         --secret [secret]     Webhook secret.
         --hook [module]       Hook invoked upon receiving an event.
  -p,    --port [port]         Server port. Default: 0.
         --ssl                 Enable HTTPS.
         --key [path]          Path to SSL key file.
         --cert [path]         Path to SSL certificate.
         --loglevel [level]    Log level. Default: info.
```

#### Notes

* 	In addition to the command-line `secret` option, the `secret` may also be specified by a `GITHUB_SECRET` environment variable. The command-line option __always__ takes precedence. 
*	Multiple `hooks` are supported. When an event is received, all hooks are provided the same payload.

	``` bash
	$ github-webhook-server --secret <secret> --hook ./hook1.js --hook ./hook2.js
	```

---
## Routes


<a name="monitor-get"></a>
===
#### GET /monitor

URI endpoint for monitoring the server application.


##### Response: 200 (application/json)

The response body will be a JSON `string` of the form

``` javascript
{
	"system": {
		"uptime": <number>,
		"load": {...},
		"mem": {...},
		"cpu": [...]
	},
	"process": {
		"pid": <number>,
		"uptime": <number>,
		"mem": {...},
		"lag": 1,
		"cpu": {...}
	},
	"response": {
		"count": <number>,
		"time": {...},
		"bytes": {...}
	}
}
```

For more information about returned metrics, see [monitor-plugin-os](https://github.com/kgryte/monitor-plugin-os) and [monitor-plugin-process](https://github.com/kgryte/monitor-plugin-process).



##### Examples

From the command-line,

``` bash
$ curl 'http://127.0.0.1:<port>/monitor'
```

From another [Node](https://nodejs.org/) application,

``` javascript
var request = require( 'request' );

request( 'http://127.0.0.1:<port>/monitor', {
	'method': 'GET'
}, onMetrics );

function onMetrics( error, response, body ) {
	if ( error ) {
		console.error( error );
		return;
	}
	console.log( body );
}
```

A request will receive a response body similar to the following:

``` javascript
{
	"system": {
		"uptime": 345806000,
		"load": {
			"1m": 1.578125,
			"5m": 1.76123046875,
			"15m": 1.7236328125
		},
		"mem": {
			"memTotal": 8589934.592,
			"memFree": 31227.904,
			"ramUtilization": 0.9963645935058594
		},
		"cpu": [
			{
				"user": 24333080,
				"nice": 0,
				"system": 18208310,
				"idle": 167442150,
				"irq": 0
			},
			{
				"user": 8365590,
				"nice": 0,
				"system": 4448480,
				"idle": 197165460,
				"irq": 0
			},
			{
				"user": 24024830,
				"nice": 0,
				"system": 13111570,
				"idle": 172843190,
				"irq": 0
			},
			{
				"user": 8527220,
				"nice": 0,
				"system": 4682440,
				"idle": 196769810,
				"irq": 0
			},
			{
				"userAverage": 16312680,
				"niceAverage": 0,
				"systemAverage": 10112700,
				"idleAverage": 183555152.5,
				"irqAverage": 0
			}
		]
	},
	"process": {
		"pid": 13896,
		"uptime": 22000,
		"mem": {
			"rss": 45531.136,
			"heapFree": 15006.672,
			"heapTotal": 33215.232,
			"heapUtilization": 0.5481990913084696,
			"memUsed": 45608.96,
			"utilization": 0.005309581756591797
		},
		"lag": 1,
		"cpu": {
			"utilization": 0
		}
	},
	"response": {
		"count": 0,
		"time": {
			"count": 0,
			"sum": 0,
			"mean": 0,
			"min": 0,
			"max": 0,
			"variance": 0
		},
		"bytes": {
			"sum": 0,
			"mean": 0,
			"min": 0,
			"max": 0,
			"variance": 0
		}
	}
}
```


<a name="loglevel-put"></a>
===
#### PUT /loglevel

URI endpoint for setting the server application log level. This endpoint is useful when probing and/or debugging a live server.


##### Request: (application/json)

The request should include a JSON body having the following fields:

*	__level__: log level. The level may be specified as either a `string` or `number`. The `string` may be one of the following (see [node-bunyan](https://github.com/trentm/node-bunyan#levels); `string` options listed along with their numeric equivalents):
	-	(60) __fatal__
	-	(50) __error__
	-	(40) __warn__
	-	(30) __info__
	-	(20) __debug__
	-	(10) __trace__

``` javascript
{
	"level": <string|number>
}
```


##### Response: 204 (text/plain)

The response body will be

```
OK
```


##### Error: 400 (application/json)

If a request contains invalid body parameters, an error response will contain the error `status` and an associated `message`

``` javascript
{
	"status": 400,
	"message": "...'"
}
```


##### Examples

From the command-line,

``` bash
$ curl -X PUT -d '{"level":"info"}' 'http://127.0.0.1:<port>/loglevel' --header "Content-type:application/json"
```

From another [Node](https://nodejs.org/) application,

``` javascript
var request = require( 'request' );

var body = {
	'level': 'info'
};

request( 'http://127.0.0.1:<port>/loglevel', {
	'method': 'PUT',
	'json': body
}, onResponse );

function onResponse( error, response, body ) {
	if ( error ) {
		console.error( error );
		return;
	}
	console.log( body );
}
```

A successful request will receive the following response body:

```
OK
```



---
## Examples

To run the example code from the top-level application directory, in one terminal

``` bash
$ node ./bin/cli -p 7331
```

and in another terminal

``` bash
$ node ./examples/index.js
```



---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/github-webhook-server.svg
[npm-url]: https://npmjs.org/package/github-webhook-server

[travis-image]: http://img.shields.io/travis/kgryte/github-webhook-server/master.svg
[travis-url]: https://travis-ci.org/kgryte/github-webhook-server

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/github-webhook-server/master.svg
[codecov-url]: https://codecov.io/github/kgryte/github-webhook-server?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/github-webhook-server.svg
[dependencies-url]: https://david-dm.org/kgryte/github-webhook-server

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/github-webhook-server.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/github-webhook-server

[github-issues-image]: http://img.shields.io/github/issues/kgryte/github-webhook-server.svg
[github-issues-url]: https://github.com/kgryte/github-webhook-server/issues
