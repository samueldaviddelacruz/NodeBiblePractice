((data) =>{

    var database = require("./database");



    data.getUser = (username, next) =>{

        database.getDb( (err, db) =>{
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


    };


    data.addUser = (user, next) =>{


        database.getDb((err, db) =>{
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


    };

    data.addToFavorite = (username,verseData,next)=>{

        database.getDb((err,db)=>{
            if(err){
                next(err);
            }else{
                db.usuarios.update({username:username}, { $addToSet: { MyFavoriteVerses: verseData } }, next);


            }

        })
    };

    data.removeFromFavorites = (username,verseData,next)=>{

        database.getDb((err,db)=>{
            if(err){
                next(err);
            }else{
                db.usuarios.update({username:username}, { $pull: { MyFavoriteVerses: verseData } }, next);


            }

        })
    };

    data.getFavoriteVerses = (username,next)=>{

        database.getDb((err,db)=>{
            if(err){
                next(err);
            }else{
                db.usuarios.find({
                    username: username.toUpperCase()
                },{MyFavoriteVerses:1}).limit(1).next(next);

            }
        })
    };


})(module.exports);