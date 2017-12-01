var greeting      = require('greeting');
exports.greetUser = greetUser;

function greetUser(callback){
	return callback(null ,greeting.random());
}
