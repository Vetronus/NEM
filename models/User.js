var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var task = require('../plugins/Task');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// User Schema
var UserSchema = new Schema
({
    name: {type: String, required: true, index: true},
    phone: {type: String, required: true, index: true},
    email: {type: String},
    pass: {type: String, required: true, select: false},
    stamp: {type: Date, default: Date.now},
});

UserSchema.index({name: 'text', phone: 'text'});

// hash the password before saving a new user
UserSchema.pre('save', async function(next){
    let user = this;
    let [err, hashedPass] = await task(bcrypt.hash(user.pass, 4));
    if(err) return next(err);
    user.pass = hashedPass;
    return next();
});


// Expose the model to the server
UserSchema.index({name: 'text'});
UserSchema.plugin(AutoIncrement, {id: 'user_id', inc_field: 'id'});
var Model = mongoose.model("User", UserSchema);
module.exports = Model;