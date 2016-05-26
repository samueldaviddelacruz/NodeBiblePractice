((hasher)=>{


var crypto = require("crypto");
hasher.createSalt = () => {
var len = 8;

return crypto.randomBytes(Math.ceil(len/2)).toString('hex').substring(0,len);

};

hasher.computeHash = (source,salt)=>{
var hmac =crypto.createHmac("sha1",salt);
var hash = hmac.update(source);
return hash.digest("hex");
}


})(module.exports)