const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed password

  createdAt: { type: Date, default: Date.now },
    updatedAt: {type: Date,default: Date.now},
    admin: {type: Boolean,default: false}
});


userSchema.methods.toJSON = function() {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

module.exports = mongoose.model('User', userSchema);
