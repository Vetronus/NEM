'use strict'
const task = require("../plugins/Task");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


async function verifyLogin(model, phone, pass){
    if(!pass) throw new Error("#400 Password is required.");
    if(!phone) throw new Error("#400 User uid is required.");
    const[e, account] = await task(model.findOne({phone}).select('+pass'));
    if(e && !e.nf) throw new Error(e);
    if(e && e.nf) throw new Error("#404 Account not found.");

    let [er, passMatched] = await task(bcrypt.compare(pass, account.pass));
    if(er && !er.nf) throw new Error(er);
    delete account.pass;
    if(passMatched) return account;
    else throw new Error("#403 Wrong Password!");
}

function generateToken(signature, expiryTime){
    let key = jwt.sign(signature, global.keys.key);
    if(expiryTime) key = jwt.sign(signature, global.keys.key, {expiresIn: expiryTime});
    let responseObj = {key: key};
    return responseObj;
}

function generateTokenPair(publicData, privateData, privateExp){
    publicData.ttyp = 'public'; privateData.ttyp = 'private';
    let d1 = generateToken(publicData);
    let d2 = generateToken(privateData, privateExp);
    let tokens = {public: d1.key, private: d2.key};
    return tokens;
}

async function zeroToken(token){
    if(!token) return false;
    const decod = await decrypt(token, global.keys.zero);
    if(!decod || !decod.uid) return false;
    else return decod;
}

async function decrypt(token, key){
    if(!key) key = global.keys.key;
    try{
        const decoded = await jwt.verify(token, key);
        return decoded;
    }
    catch(e){
        return false;
    }
}

async function verifyToken(req, res, next){
    let token = req.header('x-auth-private');
    req.gym = req.header('x-auth-gym');
    req.xpublic = req.header('x-auth-public');
    req.xtemp = req.header('x-auth-temp');

    req.zero = await zeroToken(req.header('x-auth-zero'));
    if(!req.org) req.org = req.query.org;
    if(req.zero && !req.gym) req.gym = 'zero';
    
    if(!token){req.auth = false; return next();}
    const decoded = await decrypt(token);
    if(!decoded) return next(new Error("#403 Token authenticaton failed!"));
    req.auth = decoded;
    req.gym = req.auth.gym; //TODO: change the line below accordingly
    // if(req.auth.role == 'user' && req.query.user) req.query.user = req.auth.uid;
    return next();
}

module.exports.verifyLogin = verifyLogin;
module.exports.generateToken = generateToken;
module.exports.generateTokenPair = generateTokenPair;
module.exports.verifyToken = verifyToken;
module.exports.decryptToken = decrypt;