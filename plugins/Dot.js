var handleRes = function(req, res, next){
    //middleware to send back response
    //logs all the information | req.log
    //collects all the data from req.rd (resData)
    let newResData  = {};
    if(req.rd) newResData.obj = req.rd;
    if(req.log) log(req.log);
    
    if(!req.rd){
        console.log("==========");
        console.log("| #ERROR | 404 not found.");
        console.log("==========");
        res.status(404);
        return res.json("Not Found! Empty response object.");
    }
    return res.json(newResData);
}


var handleError = function(err, req, res, next){
    let newE = {}
    let e = err.message;
    if(e.substring(0, 1) == "#" && res.statusCode === 200){
        res.status(e.substring(1,4));
    }

    if(res.statusCode === 200) {
        res.status(502);
        newE.obj = "Internal error occured. Watch the error log for more details.";
    }
    else newE.obj = err.message;

    console.log("==========");
    console.log("| #ERROR | "+err.message);
    console.log("==========");
    console.error(err);

    return res.json(newE);
}

module.exports.handleRes = handleRes;
module.exports.handleError = handleError;