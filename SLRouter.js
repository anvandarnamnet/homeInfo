var app = require("express");
var router = app.Router();
//var sl = require(__dirname + "/SL");
var request = require('request');
var departures = [];

request('https://api.resrobot.se/v2/departureBoard?key=3115da74-d2c0-4ae5-a417-47ffb530a6f1&id=740021720&maxJourneys=20&format=json&direction=740004046', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsonResp = JSON.parse(body);
        departures = [];
        for(var i = 0; i < jsonResp.Departure.length; i++ ){
          departures.push(jsonResp.Departure[i].Stops.Stop[0].depTime);
        }
     }
});


router.get('/', function(request, response) {
  response.send(departures);
});



var minutes = 10, the_interval = minutes * 60 * 1000;
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
