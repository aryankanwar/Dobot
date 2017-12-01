exports.stopAbuse  = stopAbuse;

function stopAbuse(callback){
	var items = ["Don't abuse" , 'Why abusing?' , 'Common I thought you were a better person', 'Why angry?'];
	var items = items[Math.floor(Math.random()*items.length)];
	return callback(null, items);
}