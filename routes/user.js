const express = require("express");
const router = express.Router();
const User = require('../models/UserModel');
const task = require('../plugins/Task');
const crud = require('../plugins/CRUD');


async function countUser(req, res, next){
    const[e, count] = await crud.count(User, req, res);
    if(e) return next(e);
    req.rd = count;
    return next();
}


async function listUser(req, res, next){
    const[e, list] = await crud.list(User, req, res);
    if(e) return next(e);
    req.rd = list;
    return next();
}


async function getUser(req, res, next){
    const[e, doc] = await crud.get(User, req, res);
    if(e) return next(e);
    req.rd = doc;
    return next();
}

async function getUserQuery(req, res, next){
    const[e, doc] = await crud.getQuery(User, req, res);
    if(e) return next(e);
    req.rd = doc;
    return next();
}


async function newUser(req, res, next){
    const[e, doc] = await crud.create(User, req, res);
    if(e) return next(e);
    req.rd = doc;
    return next();
}


async function updateUser(req, res, next){
    const[e, doc] = await crud.update(User, req, res);
    if(e) return next(e);
    req.rd = doc;
    return next();
}


async function archiveUser(req, res, next){
    const[e, doc] = await crud.archive(User, req, res);
    if(e) return next(e);
    req.rd = doc;
    return next();
}


async function deleteUser(req, res, next){
    const[e, doc] = await crud.remove(User, req, res);
    if(e) return next(e);
    req.rd = doc;
    return next();
}



// routes
router.get("/count", countUser);
router.get("/list", listUser);
router.get("/one/:uid", getUser);
router.get("/", getUserQuery);
router.post("/", newUser);
router.put("/:uid", updateUser);
router.delete("/:uid", archiveUser);
router.delete("/permanent/:uid", deleteUser);
module.exports = router;