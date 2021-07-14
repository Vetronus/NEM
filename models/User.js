var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var task = require('../plugins/Task');


// User Schema
var UserSchema = new Schema
({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    pass: {type: String, required: true},
    stamp: {type: Date, default: Date.now},
});


// hash the password before saving a new user
UserSchema.pre('save', async function(next){
    let user = this;
    let [err, hashedPass] = await task(bcrypt.hash(user.pass, 4));
    if(err) return next(err);
    user.pass = hashedPass;
    return next();
});


// Expose the model to the server
var Model = mongoose.model("User", UserSchema);
module.exports = Model;