exports.botName = botName;

function botName(callback){
	var name = 'I am dobot, your utilities assistant bot!';
	return callback(null, name);
}