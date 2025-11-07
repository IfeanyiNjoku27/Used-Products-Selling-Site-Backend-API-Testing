const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let crypto = require('crypto');

const UserSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: {
            type: String,
            unique: true,
            match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
        },
        username: {
            type: String,
            unique: true,
            required: "Username is required",
            trim: true
        },
        hashed_password: {
            type: String,
            required: "Password is required"
        },
        salt: String,
        created: {
            type: Date,
            default: Date.now,
            immutable: true
        },
        updated: {
            type: Date,
            default: Date.now
        },
        admin: {
            type: Boolean,
            default: false
        }

    },
    {
        collection: "users"
    }
);

UserSchema.virtual('fullName')
    .get(function () {
        return this.firstName + " " + this.lastName;
    })
    .set(function () {
        let splitName = fullName.split(' ');
        this.firstName = splitName[0] || '';
        this.lastName = splitName[1] || '';
    });

UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
}

UserSchema.virtual('password')
    .set(function (password) {
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters.')
        } else {
            this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
            this.hashed_password = this.hashPassword(password);
        }
    });

UserSchema.methods.authenticate = function (password) {
    return this.hashed_password === this.hashPassword(password);
}

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id
        delete ret.hashed_password,
            delete ret.salt
    }
});

module.exports = mongoose.model('User', UserSchema);