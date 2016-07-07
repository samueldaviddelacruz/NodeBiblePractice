(function (bibleController) {
    //requires 'index inside of data folder'
    var ApiRequestHandler = require("../Request Handlers/API.Handler.js")
    var ViewsRequestHandler = require("../Request Handlers/Views.Handler")
    var data = require("../data");
    var auth = require("../auth");
   // var request = require("request");
    bibleController.init =  (app) =>{

        app.get("/api/books",ApiRequestHandler.onGetApiBooks);
        
        app.get("/api/verses/:chapterId", ApiRequestHandler.onGetApiVerses);
        
        app.get("/api/getSingleVerse/:verseId", ApiRequestHandler.onGetApiSingleVerse);

        app.get("/api/getMyVerses", auth.ensureAuthenticated,ApiRequestHandler.onGetMyFavoriteVerses);

        app.post("/api/addToFavorite", auth.ensureAuthenticated, ApiRequestHandler.onAddToFavorites);

        app.post("/api/removeFromFavorites", auth.ensureAuthenticated, ApiRequestHandler.onRemoveFromFavorites);



        app.get("/bible", auth.ensureAuthenticated,ViewsRequestHandler.onGetBibleView);

        app.get("/FavoriteVerses", auth.ensureAuthenticated,ViewsRequestHandler.onGetMyFavoriteVersesView);

        
    }


})(module.exports);