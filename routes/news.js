var inshorts           = require('inshorts').init();
 exports.getLatestNews = getLatestNews;

function getLatestNews(callback){
  var items = ["national" , 'business' , 'sports', 'world', 'politics',
                 'technology', 'startup', 'entertainment', 'miscellaneous','hatke','science','automobile'];
  var items = items[Math.floor(Math.random()*items.length)];

 inshorts.getNews(items,function(err,result){
    if(err || !result){
      err = err || new Error('No news fetched');
      return callback(err,null);
    }
    return callback(null, result.body[0]);
  });
}