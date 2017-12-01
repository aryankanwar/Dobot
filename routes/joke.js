var oneLinerJoke = require('one-liner-joke');
exports.getJoke  = getJoke;

function getJoke(callback){
	var getRandomJoke = oneLinerJoke.getRandomJoke();
	return callback(null, getRandomJoke.body);
}

