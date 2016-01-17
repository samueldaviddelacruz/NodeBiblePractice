(function(bibleController) {
    //requires 'index inside of data folder'
    var data = require("../data");
    var auth = require("../auth")
    var request = require("request")
    bibleController.init = function(app) {
        var booksurl = 'https://bibles.org/v2/versions/spa-RVR1960/books.js?include_chapters=true';
        var bibleAPIkey = 'QNeyBv2cdkEefhkwNXjmF1NonK42cA7CmjDvGBRs'

        app.get("/api/books", function(req, res) {
            //to succesfully call a basic auth protected API
            // call .auth on the promise returned by request
            // and pass credentials
            request({
                url: booksurl,

                json: true
            }, function(error, response, body) {
                console.log(response.statusCode)
                // console.log(body)
                if (!error && response.statusCode === 200) {
                    // Print the json response
                    res.set("Content-Type", "application/json");
                    res.send(body);
                }
            }).auth(bibleAPIkey, '', false);

        });

        app.get("/api/verses/:chapterId", function(req, res) {
            //to succesfully call a basic auth protected API
            // call .auth on the promise returned by request
            // and pass credentials
            var versesurl = 'https://bibles.org/v2/chapters/' + req.params.chapterId + '/verses.js'
            console.log(versesurl)
            request({
                url: versesurl,

                json: true
            }, function(error, response, body) {
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

            auth.ensureAuthenticated,
            function(req, res) {


                res.render("bible", {
                    title: 'Bible!',
                    user: req.user
                });


            });

        app.get("/FavoriteVerses",

            auth.ensureAuthenticated,
            function(req, res) {


                res.render("FavoriteVerses", {
                    title: 'My Verses!',
                    user: req.user
                });


            });

        app.post("/api/addToFavorite", auth.ensureAuthenticated,function(req, res, next) {

            var versedata = req.body
        data.addToFavorite(req.user.username,versedata,function(err,response){
            if(err){
                console.log(err);
                next(err);

            }else{
                console.log("Success Check MongoLab" );
                console.log( response);
            }

        });

            console.log(req.body);

        });




        app.get("/api/getSingleVerse/:verseId", function(req, res) {
            //to succesfully call a basic auth protected API
            // call .auth on the promise returned by request
            // and pass credentials


            var versesurl = 'https://bibles.org/v2/verses/' + req.params.verseId + '.js';

            request({
                url: versesurl,

                json: true
            }, function(error, response, body) {
                console.log(response.statusCode)
                // console.log(body)
                if (!error && response.statusCode === 200) {
                    // Print the json response
                    res.set("Content-Type", "application/json");



                    res.send(body);
                }
            }).auth(bibleAPIkey, '', false);

        });

        app.get("/api/getMyVerses",
            auth.ensureAuthenticated,
            function(req, res) {

        data.getFavoriteVerses(req.user.username,function(err,response){
              if(err){
               console.log(err);
                }else{
                  console.log(response);
                  // Print the json response
                  res.set("Content-Type", "application/json");
                  res.send(response);

              }

});


            });

    }



})(module.exports);