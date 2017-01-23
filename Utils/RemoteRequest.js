/**
 * Created by Samuel on 7/4/2016.
 */
const request = require('request-promise');
var bibleAPIkey = 'QNeyBv2cdkEefhkwNXjmF1NonK42cA7CmjDvGBRs';
((remoteRequestHandler) =>{

    remoteRequestHandler.createRequest = async function (url) {
        let response;
        let requestOptions = {
            url: url,
            auth: {
                'user': bibleAPIkey,
                'pass': '',
                'sendImmediately': false
            },
            json: true
        };
        try {
            response = await request(requestOptions);

        } catch (ex) {
            console.log(err);
        }
        return response;
    };

})(module.exports);