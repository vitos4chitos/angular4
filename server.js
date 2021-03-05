const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/client-part'));
app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+
    '/client-part/index.html'));});
app.listen(process.env.PORT || 8080);
