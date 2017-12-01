var request = require('request');
exports.quoteUser = quoteUser;

function quoteUser(callback) {
    var url = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    request(url, function(error, response, html) {
        if (error || !html) {
            err = 'Sorry could not fetch quote at this time';
            return callback(err);
        }
        var quoteObj    = JSON.parse(html.replace("\\\'","\'"));
        var quoteText   = quoteObj.quoteText;
        var quoteAuthor = quoteObj.quoteAuthor || '';
        var quote       = quoteText + '-' + quoteAuthor;
        var quotestring = quote.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return callback (null, quotestring);
    });
}