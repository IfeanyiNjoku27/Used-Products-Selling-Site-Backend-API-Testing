var express = require('express');
var cors = require('cors');

//Database require goes here

//Router requires here
var indexRouter = require('./routes/index')

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

app.listen(3000);
console.log('Server running at http://localhost:3000/');

module.exports = app;