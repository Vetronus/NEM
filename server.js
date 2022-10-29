const fs = require("fs");
const cors = require("cors");
const morgan = require("morgan");
const Boot = require("./src/boot");
const Encoder = require("./plugins/Encoder");
const Auth = require("./plugins/Auth");

// Setup Express
const express = require("express");
const app = express();
app.use(cors());


// setting global environment and var
Boot.start();
let port = process.env.PORT || global.keys.port;
if(!global.debug) port = 80;
let p =  global.keys.shared_hosting ?  ('/'+port): "";


// Decode incoming requests
app.use("/.well-known/acme-challenge", express.static("./verify"));
app.use(express.urlencoded({extended: false})); //decodes url queries
app.use(express.json()); //decodes form data
app.use(morgan("tiny")); //logs requests
app.use(Auth.verifyToken); //handles authorization headers



// import route files
const auth = require("./routes/auth");
const user = require("./routes/user");

// route the incoming requests
app.use(p+'/auth', auth);
app.use(p+'/user', user);



// Encode outgoing response
app.use(Encoder.manageResponse);
app.use(Encoder.manageError);


// Initialize the server
let http, https;
if(global.ssl) https = require("https").createServer({
	key: fs.readFileSync(global.ssl_key),
	cert: fs.readFileSync(global.ssl_cert),
	ca: fs.readFileSync(global.ssl_ca),
},app);
else http = require("http").createServer(app);
if(global.ssl) https.listen(443, () => console.log(global.keys.name + " | HTTPS:443"));
else http.listen(port, () => console.log(global.keys.name + " | HTTP:"+port));
if(global.debug)console.log('URI => http://localhost:'+ port + p);
else console.log('URI => https://' + global.keys.api + p);