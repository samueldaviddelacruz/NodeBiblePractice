/**
 * Created by Samuel on 7/3/2016.
 */

const DB = require("../data");


(ApiRequestHandler => {
  ApiRequestHandler.onGetApiBooks = async (nodeRequest, nodeResponse) => {
    const response = await DB.getBibleBooks();
    sendResponse(nodeResponse, response);
  };

  ApiRequestHandler.onGetApiVerses = async (nodeRequest, nodeResponse) => {
    const response = await DB.getBibleVersesByChapterId(
      nodeRequest.params.chapterId
    );
    sendResponse(nodeResponse, response);
  };

  ApiRequestHandler.onGetApiSingleVerse = async (nodeRequest, nodeResponse) => {
    const response = DB.getBibleVerseById(nodeRequest.params.verseId);
    sendResponse(nodeResponse, response);
  };

  ApiRequestHandler.onAddToFavorites = (nodeRequest, nodeResponse) => {
    const versedata = nodeRequest.body;
    DB.addToFavorite(
      nodeRequest.user.username,
      versedata,
      getOnDbResponseCallback(nodeResponse)
    );
  };

  ApiRequestHandler.onRemoveFromFavorites = async (
    nodeRequest,
    nodeResponse
  ) => {
    const versedata = nodeRequest.body;

    try {
      const response = await DB.removeFromFavorites(
        nodeRequest.user.username,
        versedata
      );

      sendResponse(nodeResponse, response);
    } catch (error) {
      nodeResponse.send(401, error);
    }
  };

  ApiRequestHandler.onGetMyFavoriteVerses = async (
    nodeRequest,
    nodeResponse
  ) => {
    try {
      const response = await DB.getFavoriteVerses(nodeRequest.user.username);
//{"_id":"5d9b4cdca89d27129d32f0b9","name":"Samuel De La Cruz","email":"test@test.com","username":"TEST","passwordHash":"10e86e1747fee11efd40bb4894759b6c76a08834","salt":"56703e29","MyFavoriteVerses":[{"verseId":"spa-RVR1960:Gen.1.1","reference":"Génesis 1:1"}]}
        
      sendResponse(nodeResponse, response);
    } catch (error) {
      nodeResponse.send(401, error);
    }
  };

  function sendResponse(nodeResponse, content) {
    nodeResponse.set("Content-Type", "application/json");
    nodeResponse.send(content);
  }

  const getOnDbResponseCallback = outputStream => {
    return (error, response) => {
      if (error) {
        outputStream.send(401, error);
      } else {
        outputStream.set("Content-Type", "application/json");

        outputStream.send(response);
      }
    };
  };
})(module.exports);
