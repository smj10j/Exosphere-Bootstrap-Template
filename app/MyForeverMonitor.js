
/*
* Keeps a script running by using Forever programmatically
*
* Usage: if(!require('./MyForeverMonitor.js')(__filename)) { return; }
*
* More notes: http://zoomq.qiniudn.com/ZQScrapBook/ZqFLOSS/data/20120327190237/
*
*/

function MyForeverMonitor(scriptName) {

	// If we haven't been passed an argument 'direct_launch', abort
	if(process.argv.length > 2 && process.argv[2] == 'direct_launch') {
		console.log("");
		console.log("---------- Executing app at " + scriptName.substring(scriptName.lastIndexOf('/')+1) + "----------");
		console.log("");
		return true;
	}

	var forever = require('forever');

	var watchDirectory = __dirname + '/../';
	var monitor = forever.start(scriptName, {
		max: 10, //Prevents the runaway error issue
		watch: true,
		watchDirectory: watchDirectory,
		watchIgnoreDotFiles: '.foreverignore',
		//logFile: 'logs/forever.log',
		//outFile: 'logs/output.log',
		//errFile: 'logs/error.log',	
		options: [
			'direct_launch'
		]
	});

	monitor.on('start', function () {
		forever.startServer(monitor);
	});
	
	monitor.on('error', function(err) {
		console.log("Error: " + err);
	});

	monitor.on('exit', function() {
		console.log("Node app '" + scriptName + "' has terminated abnormally");
	});

	monitor.on('stdout', function(data) {
		if(typeof data == 'string') {
			console.log(data);		
		}
	});
	monitor.on('stderr', function(data) {
		if(typeof data == 'string') {
			console.log("ERROR: " + data);
		}
	});
	
	console.log("Forever launched '" + scriptName + "'");
	console.log("Forever is watching '" + watchDirectory + "'");

	return false;
}

module.exports = MyForeverMonitor;