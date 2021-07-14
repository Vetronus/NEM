const task = require(__dirname + "/../plugins/Task");
const AWS = require('aws-sdk');
const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: global.keys.s3_id,
    secretAccessKey: global.keys.s3_key
});

const bucketName = global.keys.s3_bucket;
const uploadExpiry = 60 * 60 * 3;
const dir = global.id;

// TODO: add option for public/private header
function getUploadURL(fileName, contentType){
    fileName = dir + '/' + fileName;
    const url = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: fileName,
        ContentType: contentType,
        ACL: 'public-read',
        Expires: uploadExpiry
    });
    console.log(url);
    return url;
}

function getDownloadURL(fileName){
    fileName = dir + '/' + fileName;
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: fileName,
        Expires: uploadExpiry
    });
    console.log(url);
    return url;
}

async function deleteFile(filename){
    let fileName = dir + '/' + fileName;
    let params = {Bucket: bucketName, Key: fileName};
    const[er, res] = await task(s3.deleteObject(params).promise());
    if(er) throw er;
    else return res;
}

module.exports = {
    getUploadURL,
    getDownloadURL,
    deleteFile
}