'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const express    = require('express');
const bodyParser = require('body-parser');
const request    = require('request');
const quotes     = require('./routes/quote');
const joke       = require('./routes/joke');
const news       = require('./routes/news');
const weather    = require('./routes/weather');
const greeting   = require('./routes/greeting');
const async      = require('async');
const bye        = require('./routes/bye');
const abuse      = require('./routes/abuse');
const help       = require('./routes/help');
const name       = require('./routes/name');
const cricket    = require('./routes/cricket');
const app        = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const server = app.listen(process.env.PORT || 5000, () => {});

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'tuxedo_cat') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    var resultWraper = {};
                    var asyncTasks = [getMessage.bind(null, event, resultWraper),
                                     sendResponse.bind(null, resultWraper)
                                    ];
                    async.series(asyncTasks, function(err, result) {
                        if (err || !result) {
                            request({
                                url: 'https://graph.facebook.com/v2.6/me/messages',
                                qs: {
                                    access_token: PAGE_ACCESS_TOKEN
                                },
                                method: 'POST',
                                json: {
                                    recipient: {
                                        id: resultWraper.sender
                                    },
                                    message: {
                                        text: err.message || err
                                    }
                                }
                            }, function(error, response) {
                                return (null);
                            });
                        }
                    })
                }
            });
        });
        res.status(200).end();
    }
});

function getMessage(event, resultWraper, callback) {
    let sender = event.sender.id;
    let text = event.message.text;
    resultWraper.sender = sender;
    var string = text.toLowerCase();
    var word = '';

    var substring = ['name', 'do', 'hi', 'hello', 'joke', 'quote', 'news', 'weather', 'temperature', 'hey', 'bye', 'bi',
                    'fuck', 'settings', 'manage', 'get started', 'help', 'made', 'developed', 'created', 'cricket', 'score'
                    ];

    var splittedWords = string.split(/\s+/).toString();

    substring.map(function(x) {
        if (splittedWords.includes(x)) {
            word = x;
        }
    })
    matchFound(word, text, resultWraper, function(err, result) {
        if (err || !result) {
            return callback(err);
        }
        return callback(null);
    });
}

function sendResponse(resultWraper, callback) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: resultWraper.sender
            },
            message: {
                text: resultWraper.text
            }
        }
    }, function(error, response) {
        if (error) {
            return callback(error, null);
        } else if (!response || !response.body) {
            var result = '';
            result = 'Kindly be more specific!';
            return callback(result, null);
        } else if (response.body.error) {
            return callback(response.body.error, null);
        }
        return callback(null);
    });
}

function matchFound(word, text, resultWraper, callback) {
    switch (word) {
        case 'made':
        case 'developed':
        case 'created':
            var result = '';
            result = ' I was developed by Aryan Kanwar';
            resultWraper.text = result;
            text = callback(null, result);
            break;
        case 'name':
            text = name.botName(function(err, result) {
                if (err) {
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            })
            break;
        case 'settings':
        case 'manage':
        case 'get started':
        case 'help':
        case 'do':
            text = help.manageBot(function(err, result) {
                if (err) {
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            })
            break;
        case 'hello':
        case 'hey':
        case 'hi':
            text = greeting.greetUser(function(err, result) {
                if (err) {
                    err = err || new Error("Couldnt fetch latest greeting");
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            });
            break;
        case 'joke':
            text = joke.getJoke(function(err, result) {
                if (err) {
                    err = err || new Error("Couldnt fetch latest news");
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            });
            break;
        case 'quote':
            text = quotes.quoteUser(function(err, result) {
                if (err) {
                    err = err || new Error("Couldnt fetch quote");
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            });
            break;
        case 'weather':
        case 'temperature':
            text = weather.getLatestTemp(text, function(err, result) {
                if (err || !result) {
                    err = err || new Error("Couldnt fetch weather");
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;

                return callback(null, result);
            });
            break;
        case 'news':
            text = news.getLatestNews(function(err, result) {
                if (err) {
                    err = err || new Error("Couldnt fetch latest news");
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            });
            break;
        case 'bye':
        case 'bi':
            text = bye.sayBye(function(err, result) {
                if (err) {
                    err = err || new Error("Couldnt fetch latest greeting");
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            });
            break;
        case 'fuck':
            text = abuse.stopAbuse(function(err, result) {
                if (err) {
                    err = err;
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            });
            break;
        case 'cricket':
        case 'score':
            text = cricket.getScore(function(err, result) {
                if (err) {
                    err = err || new Error("Couldnt fetch latest score");
                    resultWraper.text = err;
                    return callback(err, null);
                }
                resultWraper.text = result;
                return callback(null, result);
            });
            break;
        default:
            text = "Sorry Im not trained fo this input" + "\n" +
                "Type : help to see what all can I do";
            resultWraper.text = text
            callback(null, resultWraper.text);
    }
}