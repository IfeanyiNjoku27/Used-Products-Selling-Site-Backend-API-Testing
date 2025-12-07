let UserModel = require('../models/users');
let jwt = require('jsonwebtoken');
let config = require('../config/config');

module.exports.signin = async function (req, res, next) {
    try {
        let user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400);
            throw new Error("User not found");
        }

        if (!user.authenticate(req.body.password)) {
            res.status(400);
            throw new Error("Email and/or Password do not match");
        }

        let payload = {
            id: user._id,
            username: user.username
        };

        let token = jwt.sign(payload, config.SECRETKEY, {
            algorithm: "HS512",
            expiresIn: "20min"
        });

        res.json({
            success: true,
            message: "User authenticated successfully",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        next(error);
    }
};


module.exports.signup = async function (req, res, next) {
    try {
        let existing = await UserModel.findOne({ email: req.body.email });
        if (existing) {
            res.status(400);
            throw new Error("Email already registered");
        }

        let user = new UserModel(req.body);
        await user.save();

        res.json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        next(error);
    }
};


module.exports.profile = async function (req, res, next) {
    try {
        let user = await UserModel.findById(req.user._id).select("-password");
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
};


module.exports.updateProfile = async function (req, res, next) {
    try {
        let user = await UserModel.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        next(error);
    }
};
