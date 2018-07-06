var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    isAdmin: {type: Boolean, default: false},
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    avatar: String
});

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);
module.exports = User;
