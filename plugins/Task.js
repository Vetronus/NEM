var asyncTask = function(promise) 
{
    return promise.then(data => [null, data])
    .catch(err => [err]);
}

var asyncTaskx = function(promise) 
{
    return promise.then(function(data){
        if(data) return [null, data];
        else {
            let err = new Error("#404 Object Not Found!");
            err.nf = true;
            return [err];
        }
    })
    .catch(err => [err]);
}


module.exports = asyncTaskx;