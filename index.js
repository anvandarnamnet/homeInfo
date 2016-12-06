var express = require('express');
var app = express();
var getcal = require(__dirname + "/GetCal");
var sl = require(__dirname + "/SLRouter");
var wheater = require(__dirname + "/WheaterRouter");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use("/getCal", getcal);
app.use("/getSl", sl);
app.use("/getRain", wheater);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
