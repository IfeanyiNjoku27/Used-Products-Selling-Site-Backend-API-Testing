const UserModel = require('../models/users');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { expressjwt } = require('express-jwt');

module.exports.signup = async function (req, res, next) {
  try {
    const { username, email, password } = req.body;

    let existing = await UserModel.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error("Email already registered.");
    }

    let user = new UserModel({ username, email, password });
    let savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      }
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.signin = async function (req, res, next) {
  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!user.authenticate(req.body.password)) {
      res.status(400);
      throw new Error("Email and/or Password do not match.");
    }

    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, config.SECRETKEY, {
      algorithm: 'HS512',
      expiresIn: "20min"
    });

    res.json({
      success: true,
      message: "User authenticated successfully.",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.requireSign = expressjwt({
  secret: config.SECRETKEY,
  algorithms: ['HS512'],
  requestProperty: "auth",
});

module.exports.logtoken = async function (req, res, next) {
  console.log("Headers: ", req.headers);
  next();
};
