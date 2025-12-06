var express = require('express');
var cors = require('cors');
var dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database Connection
var connectDB = require('./config/db');
connectDB();

// Route requires
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var adRouter = require('./routes/adRoute');
var questionRouter = require('./routes/questionRoute');

// Error Middleware import
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

// App Setup
var app = express();

// ----------------------
// FIXED CORS CONFIGURATION
// ----------------------

const allowedOrigins = [
  "http://localhost:5173",                   // frontend (local development)
  "https://used-product-site.onrender.com", // your deployed frontend (update name if needed)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/', indexRouter);
app.use('/api/users', userRouter);
app.use('/auth', authRouter);
app.use('/api/ads', adRouter);
app.use('/api/questions', questionRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = app;
