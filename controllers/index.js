(function (controllers) {
  
    var bibleController = require("./bibleController")
    controllers.init = function (app) {
        
        bibleController.init(app);
    }

})(module.exports);