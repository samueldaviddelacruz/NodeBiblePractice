/**
 * Created by Samuel on 7/4/2016.
 */
var request = require("request");
var bibleAPIkey = 'QNeyBv2cdkEefhkwNXjmF1NonK42cA7CmjDvGBRs';
((remoteRequestHandler) =>{



    remoteRequestHandler.createRequest = (url,onRequestResponseCallback) =>{
        //to successfully call a basic auth protected API
        // call .auth on the promise returned by request
        // and pass credentials
        //noinspection JSUnresolvedFunction
        request({
                url: url,

                json: true
            },onRequestResponseCallback
        ).
        auth(bibleAPIkey, '', false);

    }
    remoteRequestHandler.getRequestResponseCallback = (outPutStream) =>{

        return (error, response, body) =>
        {

           
            if (!error && response.statusCode === 200) {
                // Print the json response
                outPutStream.set("Content-Type", "application/json");
                outPutStream.send(body);
            }
        }
    }


})(module.exports)