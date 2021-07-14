'use strict'
const express = require("express");
const router = express.Router();
const dot = require(__dirname + "/../plugins/Dot");
const file = require(__dirname + "/../plugins/File");
const task = require(__dirname + "/../plugins/Task");


async function simpleUpload(req, res, next){
    // if(req.params.example_id) example_id = req.params.example_id;
    req.rd = req.file.filename;
    next();
}


async function simpleDelete(req, res, next){
    let file_name = req.params.file_name;
    if(!file_name) return next();
    file.delete(file_name, next);
    req.rd = true;
    next();
}



// get the exam data
router.post("/", file.upload.single('file'), simpleUpload);
router.post("/:example_id", file.upload.single('file'), simpleUpload);
router.delete("/:file_name", simpleDelete);


module.exports = router;