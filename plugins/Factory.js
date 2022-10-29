const task = require("../plugins/Task");
// TODO: add authorization layer

async function count(Model, req, next, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const[e, total] = await task(Model.count(query));
    if(e && !e.nf) return next(e);
    if(e && e.nf) return 0;
    return total;
}


async function list(Model, req, next, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    let limit = (query.limit || 30)*1;
    let page = (query.page*1 || false);
    let search = query.search;
    let sort = {};
    if(query.sort) sort[query.sortBy] = query.sort*1;
    delete query.search;
    delete query.limit;
    delete query.page;
    delete query.sort;
    delete query.sortBy;
    if(search) query.$text = {$search: search};
    query.archive = query.archive == 'true';
    if(!page){ //if you want the whole list
        const [err, models] = await task(Model.find(query).sort(sort));
        if(err && !err.nf) return next(err);
        return models;
    }
    else{ //if you want pagination
        const [err, models] = await task(Model.find(query).sort(sort).skip((limit*page)-limit).limit(limit));
        if(err && !err.nf) return next(err);
        return models;
    }
}


async function get(Model, req, next, custom_id){
    if(req == null) req = {query: {}, params: {}};
    let uid = custom_id || req.params.uid || req.query.uid;
    const [err, model] = await task(Model.findById(uid));
    if(err && !err.nf) return next(err);
    return model;
}


async function getQuery(Model, req, next, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    query.archive = query.archive == 'true';
    const[err, model] = await task(Model.findOne(query));
    if(err && !err.nf) return next(err);
    return model;
}


async function create(Model, req, next, customData){
    if(req == null) req = {query: {}, params: {}};
    let newModelData = customData || req.body;
    const [err, model] = await task(Model.create(newModelData));
    if(err && !err.nf) return next(err);
    return model;
}


async function createDoc(Model, req, next, customData){
    if(req == null) req = {query: {}, params: {}};
    let newModelData = customData || req.body;
    let doc = new Model(newModelData);
    const [err, model] = await task(doc.save());
    if(err && !err.nf) return next(err);
    return model;
}


async function saveDoc(document, next){
    const [err, model] = await task(document.save());
    if(err && !err.nf) return next(err);
    return model;
}


async function update(Model, req, next, custom_id, customData){
    if(req == null) req = {query: {}, params: {}};
    let uid = custom_id || req.params.uid || req.query.uid;
    let data = customData || req.body;
    data.updated = new Date();
    const [err, model] = await task(Model.findByIdAndUpdate(uid, data, {new: true}));
    if(err && !err.nf) return next(err);
    return model;
}


async function updateQuery(Model, req, next, customQuery, customData){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    let data = customData || req.body;
    data.updated = new Date();
    const [err, model] = await task(Model.findOneAndUpdate(query, data, {new: true}));
    if(err && !err.nf) return next(err);
    return model;
}


async function updateMany(Model, req, next, customQuery, customData){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    let data = customData || req.body;
    data.updated = new Date();
    const [err, model] = await task(Model.updateMany(query, data));
    if(err && !err.nf) return next(err);
    return model;
}


async function remove(Model, req, next, custom_id){
    if(req == null) req = {query: {}, params: {}};
    let uid = custom_id || req.params.uid || req.query.uid;
    const [err, model] = await task(Model.findByIdAndDelete(uid));
    if(err && !err.nf) return next(err);
    return model;
}


async function removeQuery(Model, req, next, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const [err, model] = await task(Model.findOneAndDelete(query));
    if(err && !err.nf) return next(err);
    return model;
}


async function removeMany(Model, req, next, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const [err, model] = await task(Model.deleteMany(query));
    if(err && !err.nf) return next(err);
    return model;
}


async function removeDoc(Model, req, next, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const[err, model] = await task(Model.findOne(query));
    if(err) return next(err);
    await model.remove();
    return model;
}


async function archive(Model, req, next, custom_id, restore){
    if(restore == null || restore == undefined) restore = false;
    let uid = custom_id || req.params.uid || req.query.uid;
    let model = await update(Model, req, next, uid, {archive: !restore});
    return model;
}


async function archiveQuery(Model, req, next, customQuery, restore){
    if(restore == null || restore == undefined) restore = false;
    let query = customQuery || req.query;
    let model = await updateQuery(Model, req, next, query, {archive: !restore});
    return model;
}


async function archiveMany(Model, req, next, customQuery, restore){
    if(restore == null || restore == undefined) restore = false;
    let query = customQuery || req.query;
    let model = await updateMany(Model, req, next, query, {archive: !restore});
    return model;
}


module.exports = {count, list, get, getQuery, create, createDoc, saveDoc, update, updateQuery, updateMany, remove, removeQuery, removeMany, removeDoc, archive, archiveQuery, archiveMany};