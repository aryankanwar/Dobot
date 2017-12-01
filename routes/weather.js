var weather           = require('weather-js');
var speak             = require("speakeasy-nlp");
var async             = require("async");
exports.getLatestTemp = getLatestTemp;

function getLatestTemp(region, callback){
  var  regionObj = {};
  var asyncTasks = [getRegion.bind(null, region, regionObj),
                    findWeather.bind(null, regionObj)
                   ];
  async.series(asyncTasks , function (err, result) {
    if(err){
      return callback(err, null);
    }
    return callback(null , result[1]);
  })
}

function getRegion(region, regionObj, cb) {
   var result  = ''; 
   result      = speak.classify(region).subject;
   if(result == "undefined"){
    err = new Error('Kindly be more specific!'+ '\n' +
                    'Ask like ex: Weather of shimla ? ' + '\n' +
                    'Or Temperature of shimla?'); 
    cb(err , null);
   }
   regionObj.place = result;
   cb(null); 
}


function findWeather(regionObj,cb){
  var resultObj = '';   
  region =   regionObj.place;
  weather.find({search: region, degreeType: 'C'}, function(err, result) {
    if(err){
      err = new Error('Kindly be more specific!'+ '\n' +
                    'Ask like ex: Weather of shimla ? ' + '\n' +
                    'Or temperature of shimla?'); 
      return cb(err);
    }
    else if(result
      && result[0]  
      && Object.keys(result[0]).length
      &&  result[0].current  
      &&  result[0].current.temperature 
      &&  result[0].current.humidity 
      &&  result[0].current.windspeed
      &&  result[0].current.skytext){
       resultObj = 'The temperature of ' +  region + ' is ' +  result[0].current.temperature + '°C ' +
               ' humidity level is ' + result[0].current.humidity + '%' +
               ' wind speed is ' + result[0].current.windspeed+
               ' and it is ' + result[0].current.skytext;
      return cb(null, resultObj); 
    }
    else{
      err = "Sorry I couldnt find temperature of " + region +  " :(";
      return cb(err);
    } 

  });
} 
