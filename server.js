const http = require('http');
const request = require("request")
const express = require('express');
const app = express();
const controllers = require('./controllers');
app.set("view engine", "vash");//set view engine
app.use(express.static(__dirname + "/public"));
//opt into services
const flash = require("connect-flash");
const bodyParser = require('body-parser');
const expressSession = require('express-session')
const CookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(expressSession({secret:"thesecret"}))
app.use(flash())
app.use(CookieParser())
const auth = require('./auth')
auth.init(app);

controllers.init(app);

const server = http.createServer(app);
server.listen(3500);
//server.listen(process.env.PORT, process.env.IP)

