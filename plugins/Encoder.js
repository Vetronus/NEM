//middleware to send back responses
var manageResponse = function(req, res, next){
    //collects all the data from req.rd
    let newResData  = {};
    if(req.rd || req.rd === false || req.rd === 0) newResData.obj = req.rd;
    if(req.log) log(req.log); //logs from req.log
    
    if(req.rd === undefined || req.rd === null)
        return next(new Error('#404 No response data found'));

    return res.json(newResData);
}

// middleware to handle responses
var manageError = function(err, req, res, next){
    //extract error code
    let e = err.message;
    if(e.substring(0, 1) == "#" && res.statusCode === 200)
        res.status(e.substring(1,4));

    // if it's internal error then send a constant response
    let errRes = {}
    if(res.statusCode === 200) {
        res.status(502);
        errRes.obj = "Internal error occured. Watch the server log for more details.";
    }//otherwise send the attached response
    else errRes.obj = err.message;

    // log error on the console
    console.log("==========");
    console.log("| #ERROR | "+err.message);
    console.log("==========");
    console.error(err);

    return res.json(errRes);
}



module.exports = {manageResponse, manageError};