var app = require("express");
var router = app.Router();
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// the /getcal router
router.get('/', function(request, response) {

    // Load the client authorization
   var client_securePromise = setupCal();
   client_securePromise.then(function(secure){

     // authorize
     return authorize(secure);
   }).then(function(oauth2Client){

     // time to get our calObj
     return getCal(oauth2Client);
   }).then(function(calObj){

     // send calob to the client
     response.send(calObj);

   }).catch(function(err){
     console.log(err);
   });
});



var authorize = function(credentials) {
  return new Promise(function(resolve, reject){
    // get the auth settings
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      // if we there isn't any previously stored token:
      if (err) {
        getNewToken(oauth2Client);
      }
      // if there is a previously stored token
      else {
        oauth2Client.credentials = JSON.parse(token);
        resolve(oauth2Client);
      }
    });
  })
}

// get a new token
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}


// store the new token
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

// get a calendar
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


// setup the client secret json
var setupCal = function(){
  return new Promise(function(resolve, reject){
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        reject("err", err);
      }
      resolve(JSON.parse(content));
    });
  });
}

module.exports = router;
