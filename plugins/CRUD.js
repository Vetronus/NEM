const task = require("../plugins/Task");

async function count(Model, req, res, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const[err, total] = await task(Model.count(query));
    if(err && !err.nf) return [err];
    if(err && err.nf) return [null, 0];
    return [null, total];
}


async function list(Model, req, res, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    let limit = (query.limit || 30)*1;
    let page = (query.page*1 || false);
    let search = query.search;
    let populate = [];
    let sort = {};
    if(query.sort) sort[query.sortBy] = query.sort*1;
    if(query.populate || query.join) populate = query.populate || query.join;
    delete query.populate;
    delete query.search;
    delete query.limit;
    delete query.page;
    delete query.sort;
    delete query.sortBy;
    if(search) query.$text = {$search: search};
    query.archive = query.archive == 'true';
    if(!page){ //if you want the whole list
        const [err, models] = await task(Model.find(query).populate(populate).sort(sort));
        if(err && !err.nf) return [err];
        return [null, models];
    }
    else{ //if you want pagination
        const [err, models] = await task(Model.find(query).populate(populate).sort(sort).skip((limit*page)-limit).limit(limit));
        if(err && !err.nf) return [err];
        return [null, models];
    }
}


async function get(Model, req, res, custom_id){
    if(req == null) req = {query: {}, params: {}};
    let uid = custom_id || req.params.uid || req.query.uid;
    let populate = [];

    if((req.query.populate || req.query.join) && !custom_id) populate = req.query.populate || req.query.join;

    const [err, model] = await task(Model.findById(uid).populate(populate));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function getQuery(Model, req, res, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    query.archive = query.archive == 'true';
    const[err, model] = await task(Model.findOne(query));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function create(Model, req, res, customData){
    if(req == null) req = {query: {}, params: {}};
    let newModelData = customData || req.body;
    const populate = req.query.populate || req.query.join;
    if(populate){
        const[err, model] = await task(Model.create(newModelData).populate(populate));
        if(err && !err.nf) return [err];
        else return [null, model];
    } else {
        const[err, model] = await task(Model.create(newModelData));
        if(err && !err.nf) return [err]
        else return [null, model];
    }
}


async function createDoc(Model, req, res, customData){
    if(req == null) req = {query: {}, params: {}};
    const populate = req.query.populate || req.query.join;
    let newModelData = customData || req.body;
    let doc = new Model(newModelData);
    const [err, model] = await task(doc.save().populate(populate));
    if(err && !err.nf) return [err];
    return [null, model];
}

async function createMany(Model, req, res, customArray){
    if(req == null) req = {query: {}, params: {}};
    let modelArray = customArray || req.body.list;
    const populate = req.query.populate || req.query.join;
    const [err, model] = await task(Model.insertMany(modelArray));
    //TODO: const [err, model] = await task(Model.insertMany(modelArray).populate(populate));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function saveDoc(document, res){
    const populate = req.query.populate || req.query.join;
    const [err, model] = await task(document.save().populate(populate));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function update(Model, req, res, custom_id, customData){
    if(req == null) req = {query: {}, params: {}};
    let uid = custom_id || req.params.uid || req.query.uid;
    let populate = req.query.populate || req.query.join;
    let data = customData || req.body;
    data.updated = new Date();

    const [err, model] = await task(Model.findByIdAndUpdate(uid, data, {new: true}).populate(populate));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function updateQuery(Model, req, res, customQuery, customData){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    let data = customData || req.body;
    data.updated = new Date();

    let populate = [];
    if(query.populate || query.join) populate = query.populate || query.join;
    delete query.populate;
    delete query.join;

    const [err, model] = await task(Model.findOneAndUpdate(query, data, {new: true}).populate(populate));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function updateMany(Model, req, res, customQuery, customData){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    let data = customData || req.body;
    data.updated = new Date();

    let populate = [];
    if(query.populate || query.join) populate = query.populate || query.join;
    delete query.populate;
    delete query.join;

    const [err, model] = await task(Model.updateMany(query, data).populate(populate));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function remove(Model, req, res, custom_id){
    if(req == null) req = {query: {}, params: {}};
    let uid = custom_id || req.params.uid || req.query.uid;
    const [err, model] = await task(Model.findByIdAndDelete(uid));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function removeQuery(Model, req, res, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const [err, model] = await task(Model.findOneAndDelete(query));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function removeMany(Model, req, res, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const [err, model] = await task(Model.deleteMany(query));
    if(err && !err.nf) return [err];
    return [null, model];
}


async function removeDoc(Model, req, res, customQuery){
    if(req == null) req = {query: {}, params: {}};
    let query = customQuery || req.query;
    const[err, model] = await task(Model.findOne(query));
    if(err) return [err];
    await model.remove();
    return [null, model];
}


async function archive(Model, req, res, custom_id, restore){
    if(restore == null || restore == undefined) restore = false;
    let uid = custom_id || req.params.uid || req.query.uid;
    let [err, model] = await update(Model, req, res, uid, {archive: !restore});
    if(err) return [err];
    return [null, model];
}


async function archiveQuery(Model, req, res, customQuery, restore){
    if(restore == null || restore == undefined) restore = false;
    let query = customQuery || req.query;
    let [err, model] = await updateQuery(Model, req, res, query, {archive: !restore});
    if(err) return [err];
    return [null, model];
}


async function archiveMany(Model, req, res, customQuery, restore){
    if(restore == null || restore == undefined) restore = false;
    let query = customQuery || req.query;
    let [err, model] = await updateMany(Model, req, res, query, {archive: !restore});
    if(err) return [err];
    return [null, model];
}


module.exports = {count, list, get, getQuery, create, createMany, createDoc, saveDoc, update, updateQuery, updateMany, remove, removeQuery, removeMany, removeDoc, archive, archiveQuery, archiveMany};