(function (data) {

 var database = require("./database");
  


data.getUser = function(username,next){

 database.getDb(function (err, db){
            if (err) {
                next(err)
            }else{


            db.usuarios.findOne({username:username},next);

            }
            
}
)


}


data.addUser = function(user,next){
 

 database.getDb(function (err, db){
            if (err) {
                console.log(err);
            }else{


            db.usuarios.insert(user,next);

            }       

}
)


}

})(module.exports);