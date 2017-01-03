var req = require('request');
var app = require("express");
var router = app.Router();

// the router for /getrain
router.get('/', function(request, response) {
  // get the current time
  var time = Math.floor(Date.now() / 1000);
  // the api string
  var api = "https://api.darksky.net/forecast/85ef6d80f3f76f1540596b5919f67fe0/59.3,18," + time + "?lang=sv&units=si";

  // make the request and send the response
  req(api, function (error, respon, body) {
      if (!error && response.statusCode == 200) {
          var jsonResp = JSON.parse(body);
          var resp = [];
          resp.push(jsonResp.currently);
          response.send(resp);
       }

  });
});




module.exports = router;
