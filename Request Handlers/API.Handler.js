/**
 * Created by Samuel on 7/3/2016.
 */
var RemoteRequest = require("../Utils/RemoteRequest.js");
var DB = require("../data");
const booksurl = 'https://bibles.org/v2/versions/spa-RVR1960/books.js?include_chapters=true';

( (ApiRequestHandler) =>{


    ApiRequestHandler.onGetApiBooks = async(nodeRequest, nodeResponse) => {

        let response = await RemoteRequest.createRequest(booksurl);
        sendResponse(nodeResponse, response);
    };


    ApiRequestHandler.onGetApiVerses = async(nodeRequest, nodeResponse) => {
        let versesurl = `https://bibles.org/v2/chapters/${nodeRequest.params.chapterId}/verses.js`;
        let response = await RemoteRequest.createRequest(versesurl);
        sendResponse(nodeResponse, response);
    };


    ApiRequestHandler.onGetApiSingleVerse = async(nodeRequest, nodeResponse) => {

        var versesurl = `https://bibles.org/v2/verses/${nodeRequest.params.verseId}.js`;
        let response = await RemoteRequest.createRequest(versesurl);
        sendResponse(nodeResponse, response);

    };


    
    ApiRequestHandler.onAddToFavorites = (nodeRequest, nodeResponse) => {

        var versedata = nodeRequest.body;
        DB.addToFavorite(nodeRequest.user.username, versedata,getOnDbResponseCallback(nodeResponse) );

    };


    ApiRequestHandler.onRemoveFromFavorites = async(nodeRequest, nodeResponse) => {

        let versedata = nodeRequest.body;

        let response;
        try {
            response = await DB.removeFromFavorites(nodeRequest.user.username, versedata);

            sendResponse(nodeResponse, response);

        } catch (error) {
            nodeResponse.send(401, error);
        }

    };


    ApiRequestHandler.onGetMyFavoriteVerses = async(nodeRequest, nodeResponse) => {

        //DB.getFavoriteVerses(nodeRequest.user.username,getOnDbResponseCallback(nodeResponse) );
        let response;
        try {
            response = await DB.getFavoriteVerses(nodeRequest.user.username);

            sendResponse(nodeResponse, response);

        } catch (error) {
            nodeResponse.send(401, error);
        }

    };

    function sendResponse(nodeResponse, content) {
        nodeResponse.set("Content-Type", "application/json");
        nodeResponse.send(content);
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
