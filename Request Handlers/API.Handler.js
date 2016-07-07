/**
 * Created by Samuel on 7/3/2016.
 */
var RemoteRequest = require("../Utils/RemoteRequest.js");
var DB = require("../data");
( (ApiRequestHandler) =>{

   
    ApiRequestHandler.onGetApiBooks = (nodeRequest, nodeResponse) =>{
        
        getBibleBooksFromAPI( RemoteRequest.getRequestResponseCallback(nodeResponse) )

    };
    var getBibleBooksFromAPI = (onRequestResponseCallback) =>{
        var booksurl = 'https://bibles.org/v2/versions/spa-RVR1960/books.js?include_chapters=true';
        RemoteRequest.createRequest(booksurl,onRequestResponseCallback);

    };


    ApiRequestHandler.onGetApiVerses = (nodeRequest, nodeResponse) =>{
        
        getBibleVersesFromAPI(nodeRequest, RemoteRequest.getRequestResponseCallback(nodeResponse) )

    };
    var getBibleVersesFromAPI = (nodeRequest,onRequestResponseCallback) =>{

        var versesurl = `https://bibles.org/v2/chapters/${nodeRequest.params.chapterId}/verses.js`;
        RemoteRequest.createRequest(versesurl,onRequestResponseCallback);

    };

    ApiRequestHandler.onGetApiSingleVerse = (nodeRequest, nodeResponse) =>{

        getBibleSingleVerseFromAPI(nodeRequest, RemoteRequest.getRequestResponseCallback(nodeResponse) )

    };
    var getBibleSingleVerseFromAPI = (nodeRequest,onRequestResponseCallback) =>{
        
        var versesurl = `https://bibles.org/v2/verses/${nodeRequest.params.verseId}.js`;
        RemoteRequest.createRequest(versesurl,onRequestResponseCallback);

    }
    
    ApiRequestHandler.onAddToFavorites = (nodeRequest, nodeResponse) => {

        var versedata = nodeRequest.body;
        DB.addToFavorite(nodeRequest.user.username, versedata,getOnDbResponseCallback(nodeResponse) );


    }


    ApiRequestHandler.onRemoveFromFavorites = (nodeRequest, nodeResponse) => {

        var versedata = nodeRequest.body;
        DB.removeFromFavorites(nodeRequest.user.username, versedata,getOnDbResponseCallback(nodeResponse) );


    }



    ApiRequestHandler.onGetMyFavoriteVerses = (nodeRequest, nodeResponse) => {

        DB.getFavoriteVerses(nodeRequest.user.username,getOnDbResponseCallback(nodeResponse) );

    }


    var getOnDbResponseCallback = (outputStream) =>{
        return (error, response) => {
            if(error){

                outputStream.send(401,error);

            }else{

                outputStream.set("Content-Type", "application/json");

                outputStream.send(response);

            }
        }
    }
    

})(module.exports);
