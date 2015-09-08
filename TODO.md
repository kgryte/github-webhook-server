TODO
====

1. Clean up the README
2. create-a-server
	-	include `cluster` mode
3. make a `monitor` module
	-	singleton
	-	or like Bunyan, where you can create a child monitor
	-	require and then update
	-	or for IoC, something which is passed in like a logger
4. monitor route should then just accept a `monitor` argument and simply stringify the results
	-	monitor router
		-	`/monitor`
		-	`/monitor/uptime`
		-	`/monitor/os`
		-	...
5. determine how `start` and `finish` can be extracted
6. extract basic bunyan logger
7. 
