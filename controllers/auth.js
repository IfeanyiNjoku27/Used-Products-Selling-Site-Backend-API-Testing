let UserModel = require('../models/users');
let jwt = require('jsonwebtoken');
let config = require('../../config/config');
let { expressjwt } = require('express-jwt');

module.exports.signin = async function (req, res, next) {
    try {
        // Get the user based on email
        console.log(req.body);
        let user = await UserModel.findOne({ "email": req.body.email });
        if (!user)
            throw new Error("User not found");

        // Validate the password
        if (!user.authenticate(req.body.password))
            throw new Error("Email and/or Password do not match.");

        // Generate the token
        let payload = {
            id: user._id,
            username: user.username
        };

        let token = jwt.sign(payload, config.SECRETKEY, {
            algorithm: 'HS512',
            expiresIn: "20min"
        })

        //send the token in the body of the response
        res.json(
            {
                success: true,
                message: "User authenticated successfully.",
                token: token
            }
        );

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.requireSign = expressjwt({
    secret: config.SECRETKEY,
    algorithms: ['HS512'],
    userProperty: 'auth'
})

module.exports.logtoken = async function (req, res, next) {
    console.log(req.headers);
    next();
}

