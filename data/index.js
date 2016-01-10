(function(data) {

    var database = require("./database");



    data.getUser = function(username, next) {

        database.getDb(function(err, db) {
            if (err) {
                next(err)
            } else {

                //db.usuarios.findOne({username:username.toUpperCase()},function(user,next){
                //    console.log(user);
                //
                //});
                db.usuarios.find({
                    username: username.toUpperCase()
                }).limit(1).next(next);


                //db.usuarios.findOne({username:username.toUpperCase()},next);

            }

        })


    }


    data.addUser = function(user, next) {


        database.getDb(function(err, db) {
            if (err) {
                console.log(err);
                next(err);
            } else {

                //db.usuarios.findOne({username:user.username.toUpperCase()},function(err,user){
                //    if(user){
                //        console.log('User already Registered!');
                //    return  next(err);
                //
                //    }
                //
                //});
                db.usuarios.insert(user, next);


            }

        })


    }

})(module.exports);