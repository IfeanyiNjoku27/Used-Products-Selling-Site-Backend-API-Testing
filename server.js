var express = require('express');
var cors = require('cors');

//Database require goes here
var connectDB = require('./config/db');
connectDB();

//Router requires here
var indexRouter = require('./routes/index')
var userRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

app.use('/', indexRouter)
app.use('/api/users', userRouter);
app.use('/auth', authRouter);


app.listen(3000);
console.log('Server running at http://localhost:3000/');

module.exports = app;