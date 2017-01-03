var app = require("express");
var router = app.Router();
var request = require('request');
var departures = [];

// make an api request to sl and save the response in departures[]
request('https://api.resrobot.se/v2/departureBoard?key=3115da74-d2c0-4ae5-a417-47ffb530a6f1&id=740021720&maxJourneys=20&format=json&direction=740004046', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsonResp = JSON.parse(body);
        departures = [];
        for(var i = 0; i < jsonResp.Departure.length; i++ ){
          departures.push(jsonResp.Departure[i].Stops.Stop[0].depTime);
        }
     }
});

// router for /getsl. Return relevant sl data
router.get('/', function(request, response) {
  makeDateRelevant();

  response.send(departures);
});

// make the departures[] relevant
var makeDateRelevant = function(){
  var date = new Date();

  for(var i = 0; i < departures.length; i++){
    var splittedData = departures[i].split(":");

    if(splittedData[i] == date.getHours){
      if(splittedData[1] < date.getMinutes()){
        departures.splice(i, 1);
      }
    }
  }
}

// make the data relevant every 10 second
setInterval(function(){
  var date = new Date();
  for(var i = 0; i < departures.length; i++){
    var splittedData = departures[i].split(":");

    if(splittedData[i] == date.getHours){
      if(splittedData[1] < date.getMinutes()){
        departures.splice(i, 1);
      }
    }
  }

},10000)

// send an api call to sl every 5 minutes
var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  request('https://api.resrobot.se/v2/departureBoard?key=3115da74-d2c0-4ae5-a417-47ffb530a6f1&id=740021720&maxJourneys=20&format=json&direction=740004046', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var jsonResp = JSON.parse(body);
          departures = [];
          for(var i = 0; i < jsonResp.Departure.length; i++ ){
            departures.push(jsonResp.Departure[i].Stops.Stop[0].depTime);
          }


       }
  });
}, the_interval);

module.exports = router;
