var app = require("express");
var router = app.Router();
var fet = require(__dirname + "/Calendar");

router.get('/', function(request, response) {
  console.log(fet.events);
  response.render('pages/index');
});

module.exports = router;
