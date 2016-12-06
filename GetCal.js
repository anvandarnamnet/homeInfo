var app = require("express");
var router = app.Router();
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

//var fet = require(__dirname + "/Calendar");
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';


router.get('/', function(request, response) {
   var client_securePromise = setupCal();
   client_securePromise.then(function(secure){

     return authorize(secure);
   }).then(function(oauth2Client){
     return getCal(oauth2Client);
   }).then(function(calObj){

     response.send(calObj);
   }).catch(function(err){
     console.log(err);
   });



});



var authorize = function(credentials) {
  return new Promise(function(resolve, reject){
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        //getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);

        resolve(oauth2Client);
      }
    });
  })

}

var getCal = function(auth){
  return new Promise(function(resolve,reject){
    var calendar = google.calendar('v3');
    calendar.events.list({
      auth: auth,
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject(err);
      }
      var events = response.items;

      resolve(events);

    });
  });
}

var setupCal = function(){
  return new Promise(function(resolve, reject){
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        reject("err", err);
      }
      resolve(JSON.parse(content));
  });

    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.

    //authorize(JSON.parse(content), listEvents);
  });
}


module.exports = router;
