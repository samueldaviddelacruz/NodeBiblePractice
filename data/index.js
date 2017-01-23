((data) =>{

    var database = require("./database");


    data.getUser = async(username) => {

        let db;
        try {
            let user;
            db = await database.getDb();

            user = await db.usuarios.findOne({
                username: username.toUpperCase()
            });

            return user;
        } catch (err) {
            throw err;
        }

    };


    data.addUser = async(user) => {

        let db;
        try {
            db = await database.getDb();
            return await db.usuarios.insert(user);
        } catch (err) {
            console.log(err);
            throw err;
        }

    };

    data.addToFavorite = async(username, verseData, next) => {
        let db;
        try {
            db = await database.getDb();
            db.usuarios.update({username: username}, {$addToSet: {MyFavoriteVerses: verseData}}, next);
        } catch (err) {
            next(err);
        }

    };

    data.removeFromFavorites = async(username, verseData) => {

        let db;
        try {
            db = await database.getDb();
            await db.usuarios.update({username: username}, {$pull: {MyFavoriteVerses: verseData}});
        } catch (err) {
            console.log(err)
            throw err;
        }

    };

    data.getFavoriteVerses = async(username, next) => {

        let db;
        try {
            db = await database.getDb();

            let verses = db.usuarios.findOne({
                username: username.toUpperCase()
            }, {MyFavoriteVerses: 1});

            return verses;
        } catch (err) {
            console.log(err)
            throw err;
        }
    };

   





})(module.exports);