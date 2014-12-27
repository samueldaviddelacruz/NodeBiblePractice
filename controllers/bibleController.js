(function (bibleController) {
    //requires 'index inside of data folder'
    var data = require("../data");
    var auth = require("../auth")
    var request = require("request")
    bibleController.init = function (app) {
    var booksurl = 'https://bibles.org/v2/versions/spa-RVR1960/books.js?include_chapters=true';
    var bibleAPIkey = 'QNeyBv2cdkEefhkwNXjmF1NonK42cA7CmjDvGBRs'
    
app.get("/api/books", function(req, res) {
//to succesfully call a basic auth protected API
// call .auth on the promise returned by request
// and pass credentials
request({
    url: booksurl,
    
    json: true
}, function (error, response, body) {
        console.log(response.statusCode) 
       // console.log(body)
    if (!error && response.statusCode === 200) {
        // Print the json response
        res.set("Content-Type", "application/json");
        res.send(body); 
    }
}).auth(bibleAPIkey, '', false);
            
});

app.get("/api/verses/:verseId", function(req, res) {
//to succesfully call a basic auth protected API
// call .auth on the promise returned by request
// and pass credentials
var versesurl = 'https://bibles.org/v2/chapters/'+req.params.verseId+'/verses.js'
console.log(versesurl)
request({
    url: versesurl,
    
    json: true
}, function (error, response, body) {
        console.log(response.statusCode) 
       // console.log(body)
    if (!error && response.statusCode === 200) {
        // Print the json response
        res.set("Content-Type", "application/json");
        res.send(body); 
    }
}).auth(bibleAPIkey, '', false);
            
});


     app.get("/bible", 

            auth.ensureAuthenticated,function (req, res){
            res.render("bible", { title: 'Bible!',  user:req.user });
        })



}



})(module.exports);