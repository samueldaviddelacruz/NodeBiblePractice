var http = require('http');
var express = require('express');
var app = express();
//var controllers = require('./controllers');
app.set("view engine", "vash");//set view engine
app.use(express.static(__dirname + "/public"));
//opt into services
var flash = require("connect-flash");
var bodyParser = require('body-parser');
var expressSession = require('express-session')
var CookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(expressSession({secret:"thesecret"}))
app.use(flash())
app.use(CookieParser())
// var auth = require('./auth')
// auth.init(app);

// controllers.init(app);
app.get("/api/users", function(req, res) {

    res.set("Content-Type", "application/json");
    res.send({ name: "Samy", isValid: true, group: "Admin" });
    
});
var server = http.createServer(app);
server.listen(3500);

