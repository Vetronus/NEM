'use strict'
const task = require(__dirname + "/../plugins/Task");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


async function verifyLogin(model, login){
    if(!login.pass) throw new Error("#400 Password is required.");
    
    const[e, account] = await task(model.findOne({phone: login.phone}));
    if(e && !e.nf) throw new Error(e);
    if(e && e.nf) throw new Error("#404 Account not found.");

    let [er, passMatched] = await task(bcrypt.compare(login.pass, account.pass));
    if(er && !er.nf) throw new Error(er);
    delete account.pass;
    if(passMatched) return account;
    else throw new Error("#403 Wrong Password!");
}


function generateToken(signature){
    const key = jwt.sign(signature, global.keys.key);
    let responseObj = {key: key};
    return responseObj;
}


async function decrypt(token){
    try{
        const decoded = await jwt.verify(token, global.key);
        return decoded;
    }
    catch(e){
        return false;
    }
}

async function verifyToken(req, res, next){
    let token = req.header('x-auth-token');
    if(!token) {
        req.auth = false;
        return next();
    }

    const decoded = await decrypt(token);
    if(!decoded) return next(new Error("#403 Token authenticaton failed!"));
    req.auth = decoded;
    return next();
}


module.exports.verifyLogin = verifyLogin;
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;