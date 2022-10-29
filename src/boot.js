const fs = require("fs");
let keys = require('./keys.json');
const mongoose = require("mongoose");
let task = require('../plugins/Task');


function loadKeys() {
    console.log('Loading...');
    process.env.TZ = keys.tz;
    global.keys = keys;
    global.debug = true;
    global.ssl = false;
    
    // SSL Setup
    global.uri = keys.d_db;
    global.ssl_cert = keys.letsencrypt_path + keys.api + '/' + 'cert.pem';
    global.ssl_key = keys.letsencrypt_path + keys.api + '/' + 'privkey.pem';
    global.ssl_ca = keys.letsencrypt_path + keys.api + '/' + 'chain.pem';
    if(fs.existsSync(global.ssl_cert)) global.ssl = true;

    // platform setup
    let platform = "Droplet | DigitalOcean";
    if(process.platform === "darwin") platform = "Macintosh | Home";
    else if(process.env.isHeroku === "true") platform = "Worker | Heroku";
    else { global.uri = keys.p_db; global.debug = false; }
    console.log('Platform => ' + platform);
    console.log("Debugging => " + global.debug.toString());
}

function connectDatabse() {
    console.log('DB Connecting...')
    mongoose.Promise = Promise;
    mongoose.connect(global.uri);
    var db = mongoose.connection;
    db.on("error", (err) => console.error("DB Connection Error: ", err));
    db.once("open", () => {
        console.log("DB Connected.");
        tasks();
    });
}

async function tasks(){
    console.log('Executing startup tasks...');
    console.log('Ready.');
}

function start(){
    loadKeys();
    connectDatabse();
}

module.exports.start = start;
