var express = require('express');
var app = express();
var fs=require('fs');

app.get('/', function (req, res) {
	res.sendFile('/var/www/bettertokens/public/index.html');
});

app.listen(2000, function () {
  console.log('Example app listening on port 3000!');
});

