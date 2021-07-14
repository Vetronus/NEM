'use strict'
const express = require("express");
const router = express.Router();
const User = require(__dirname + "/../models/User");
const task = require(__dirname + "/../plugins/Task");


async function listUsers(req, res, next){
    let query = {};
    let search = req.query.search;
    if(search) query = {$text: {$search: search}};

    let limit = (req.query.limit || 10)*1;
    let page = req.query.page*1;

    const [err, users] = await task(User.find(query).skip((limit*page)-limit).limit(limit));
    if(err & !err.nf) return next(err);
    req.rd = users;
    return next();
}


async function countUsers(req, res, next){
    let query = req.query;
    const [err, users] = await task(User.count(query));
    if(err & !err.nf) return next(err);
    req.rd = users;
    return next();
}


async function getUser(req, res, next){
    if(req.rd) next();
    let user_id = req.params.uid || req.auth.uid;
    const [err, user] = await task(User.findById(user_id));
    if(err) return next(err);
    delete user.pass;
    req.rd = user;
    return next();
}


async function newUser(req, res, next)
{
    let newUserInfo = req.body;
    let newUser = new User(newUserInfo);

    // check if the user with the same id already exists
    const[e, userExists] = await task(User.findOne({phone: newUserInfo.phone}));
    if(e && !e.nf) return next(e);
    if(userExists) return next(new Error("#400 Phone already registered."));
    
    // save new user
    const [err, user] = await task(newUser.save());
    if(err) return next(err);
    delete user.pass;
    req.rd = user;
    return next();
}


async function updateUser(req, res, next){
    let user_id = req.params.uid || req.auth.uid;
    let userUpdate = req.body; let pass;
    if(userUpdate.pass) pass = userUpdate.pass;
    delete userUpdate.pass;

    // check if phone already exists
    const[e, userExists] = await task(User.findOne({phone: userUpdate.phone}));
    if(e && !e.nf) return next(e);
    if(userExists && userExists._id != user_id) return next(new Error("#400 Phone already registred"));

    // update the user info
    const [err, updatedUser] = await task(User.findByIdAndUpdate(user_id, userUpdate, {new: true}));
    if(err) return next(err);
    
    // if user requested to update pass
    if(pass) {
        updatedUser.pass = pass;
        const[e, user] = await task(updatedUser.save());
        if(e) return next(e);
    }

    delete updatedUser.pass;
    req.rd = updatedUser;
    return next();
}


async function deleteUser(req, res, next){
    let user_id = req.params.uid || req.auth.uid;
    const [err, user] = await task(User.findByIdAndDelete(user_id));
    if(err) return next(err);
    req.rd = user;
    return next();
}



// routes
router.post("/", newUser);
router.get("/list", listUsers);
router.get("/count", countUsers);
router.get("/:uid", getUser);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);
module.exports = router;