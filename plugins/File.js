const fs = require('fs');
const fsPromises = fs.promises;
const multer = require('multer');
const task = require('./Task.js');


// set path to save file
function setFileDestination(req, file, cb)
{
  cb(null, '/uploads');
  // cb(null, "~/uploads");
}

// set the name of the file
function setFileName(req, file, cb)
{
    // let extArray = file.mimetype.split("/");
    // let fileExtension = extArray[extArray.length - 1];
    // cb(null, (new Date()).getTime() + "." + fileExtension);
    let file_pre_name = req.auth.admin;
    if(req.auth.user) file_pre_name = req.auth.user;
    if(req.auth.owner) file_pre_name = req.auth.owner;
    cb(null, (file_pre_name + "_" + (new Date()).getTime() + "_" + file.originalname));
}

// what files will be allowed to save
function fileFilter(req, file, cb)
{
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

//create storage settings obj
const storageSettings = {};
storageSettings.destination = setFileDestination;
storageSettings.filename = setFileName;

//pass the storage setting to storage engine
const storageEngine = multer.diskStorage(storageSettings);

//new upload settings
const uploadSettings = {}
uploadSettings.storage = storageEngine;
// uploadSettings.fileFilter = fileFilter; //dont need file filter rn
uploadSettings.limits = {fileSize: 1024*1024*512}; //it's 10MB but have to find a way to check the limit

const upload = multer(uploadSettings);


// File Delete
async function deleteFile(fileName, next)
{
  const[err, result] = await task(fsPromises.unlink(global.FILES + "/" + fileName));
  if(err) 
  {
    console.log("==========");
    console.log("| 001#ERROR | "+err.message);
    console.log("==========");
    return next(err);
  }
  return next();
}


module.exports.upload = upload;
module.exports.delete = deleteFile;