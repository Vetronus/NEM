'use strict'

async function user(req, res, next){
    if(req.auth) return next();
    return next(e.noAuth);
}

async function admin(req, res, next){
    if(req.auth && req.auth.type == 'admin') return next();
    return next(e.forbidden);
}


// Errors
const e = {
    badReq: new Error('#400 Please send valid details to perform this action.'),
    forbidden: new Error('#401 Your account does not have permission to perform this action.'),
    unpaid: new Error('#402 Please complete your payments to perform this action.'),
    noAuth: new Error('#403 Please login to perform this action.'),
    notFound: new Error('#404 The data you were looking for does not exist.'),
    serverCrashed: new Error('#500 Server could not complete your request. Please contact support.'),
    paymentServerCrashed: new Error('#502 Payment server is sending invlaid reponse. Please contact support.')
}

module.exports = {e, user, admin};