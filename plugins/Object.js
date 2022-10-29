const task = require("../plugins/Task");
const AWS = require('aws-sdk');
const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: global.keys.s3_id,
    secretAccessKey: global.keys.s3_key
});

const bucketName = global.keys.s3_bucket;
const uploadExpiry = 60 * 60 * 3;
const dir = global.keys.id;


function getUploadURL(fileName, contentType, s3authHeader){
    fileName = dir + '/' + fileName;
    const url = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: fileName,
        ContentType: contentType,
        ACL: s3authHeader,
        Expires: uploadExpiry
    });
    return url;
}

function getDownloadURL(fileName){
    fileName = dir + '/' + fileName;
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: fileName,
        Expires: uploadExpiry
    });
    return url;
}

async function deleteFile(filename){
    // let fileName = dir + '/' + fileName;
    let params = {Bucket: bucketName, Key: filename};
    const[er, res] = await task(s3.deleteObject(params).promise());
    if(er) throw er;
    else return res;
}

module.exports = {
    getUploadURL,
    getDownloadURL,
    deleteFile
}