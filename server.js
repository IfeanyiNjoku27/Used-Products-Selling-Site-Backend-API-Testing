var express = require('express');
var cors = require('cors');
var dotenv = require('dotenv');

//Load enviroment variables
dotenv.config();

//Database Connection
var connectDB = require('./config/db');
connectDB();

//Route requires
var indexRouter = require('./routes/index')
var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var adRouter = require('./routes/adRoute');
var quesstionRouter = require('./routes/questionRoute');

//Error Middleware import
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

//App Setup
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}))


//Api routes
app.use('/', indexRouter)
app.use('/api/users', userRouter);
app.use('/auth', authRouter);
app.use('/api/ads', adRouter);
app.use('/api/questions', quesstionRouter);


//Error handling middleware
app.use(notFound);
app.use(errorHandler);

//Start server setup
app.listen(3000);
console.log('Server running at http://localhost:3000/');

module.exports = app;