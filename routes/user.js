'use strict'
const express = require("express");
const router = express.Router();
const User = require(__dirname + "/../models/User");
const task = require(__dirname + "/../plugins/Task");


async function getAllUsers(req, res, next){
    const [err, users] = await task(User.find());
    if(err & !err.nf) return next(err);
    req.rd = users;
    return next();
}


async function getOneUser(req, res, next){
    if(req.params.user_id == "all") next();
    let user_id = req.params._id || req.auth.user;
    if(!user_id) return next(new Error("#400 No user linkage provided."));
    const [err, user] = await task(User.findById(user_id));
    if(err) return next(err);
    req.rd = user;
    return next();
}


async function createNewUser(req, res, next)
{
    let newUserInfo = req.body;
    let newUser = new User(newUserInfo);

    // check if the user with the same id already exists
    const[e, userExists] = await task(User.findOne({id: newUserInfo.id}));
    if(e && !e.nf) return next(e);
    if(userExists) return next(new Error("#400 User ID already exists."));
    
    // save new user
    const [err, user] = await task(newUser.save());
    if(err) return next(err);
    req.rd = user;
    return next();
}


async function updateUser(req, res, next)
{
    let user_id = req.params._id;
    let userUpdate = req.body;
    if(userUpdate.pass) delete userUpdate.pass;

    // check if the new id already exists
    if(userUpdate.id){
        const[e, userExists] = await task(User.findOne({id: userUpdate.id}));
        if(e && !e.nf) return next(e);
        if(userExists && userExists._id != user_id) return next(new Error("#400 User ID already exists."));
    }

    // update the user info
    const [err, updatedUser] = await task(User.findByIdAndUpdate(user_id, userUpdate, {new: true}));
    if(err) return next(err);
    req.rd = updatedUser;
    return next();
}


async function deleteUser(req, res, next){
    let user_id = req.params._id;
    const [err, user] = await task(User.findByIdAndDelete(user_id));
    if(err) return next(err);
    req.rd = user;
    return next();
}



// get all the users from the institute
router.get("/all", getAllUsers);

// create new user
router.post("/", createNewUser);

// get one user, using its _id
router.get("/:user_id", getOneUser);

// update existing user, using its _id
router.put("/:user_id", updateUser);

// delete one user, using its _id
router.delete("/:user_id", deleteUser);


module.exports = router;