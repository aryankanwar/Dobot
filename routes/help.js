exports.manageBot = manageBot;

function manageBot(callback) {
   var hepText = '* I can tell weather of your city' + '\n' +
   				 '* I can tell you latest news' + '\n' +
   				 '* I can tell you a joke'+ '\n' +
   				 '* I can tell you a quote' + '\n' +
   				 '* I can tell you latest cricket score'+ '\n' +'\n' +
   				 ' What do you want me to do?';
   return callback(null, hepText);
}