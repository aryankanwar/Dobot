var parting = require('parting');
exports.sayBye  = sayBye;

function sayBye(callback) {
	return callback(null, parting.random());
}