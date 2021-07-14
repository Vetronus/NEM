'use strict'
const express = require("express");
const router = express.Router();
const Auth = require(__dirname + "/../plugins/Auth");
const User = require(__dirname + "/../models/User");
const task = require(__dirname + "/../plugins/Task");

function Token(account){
    let sign = {uid: account._id, type: account.type};
    let token = Auth.generateToken(sign);
    return token;
}

async function login(req, res, next){
    if(!req.body.phone || !req.body.pass) return next("#400 Please send login data.");
    let login = {phone: req.body.phone, pass: req.body.pass};
    const[e, account] = await task(Auth.verifyLogin(User, login));
    if(e) return next(e);

    let token = Token(account);
    if(!token) return next(new Error("#403 An error occured while generating token"));
    req.rd = token;
    return next();
}

async function signup(req, res, next){
    // check if the user exists with the same phone
    let data = req.body;
    const[ez, exists] = await task(User.findOne({phone: data.phone}));
    if(ez && !ez.nf) return next(ez);
    if(exists) return next(new Error('#400 User with same phone already exists.'));

    // create the user from this data
    let newUser = new User(data);
    const[er, user] = await task(newUser.save());
    if(er) return next(er);

    // generate and send auth token
    let token = Token(user);
    if(!token) return next(new Error("#403 An error occured while generating token"));
    req.rd = token;
    return next();
}


router.post("/login", login);
router.post("/signup", signup);
module.exports = router;