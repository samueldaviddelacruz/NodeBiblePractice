( (database) =>{
        let promise = require("bluebird");
        var mongodb = promise.promisifyAll(require("mongodb"));
    var mongoUrl = "mongodb://ingsamy:mega007@ds059519.mongolab.com:59519/mongolabdb";


    var theDb = null;
        database.getDb = async() => {
        if (!theDb) {
        //connecto the database
            let db;
            try {
                let db = await mongodb.MongoClient.connect(mongoUrl);

                theDb = {
                    db: db,
                    usuarios: db.collection("usuarios")
                };
                theDb.usuarios = promise.promisifyAll(theDb.usuarios);

                return theDb;
            } catch (err) {
                //next(err, null);
                throw err;
            }
            ;
        }
            return theDb;
    }

}
)(module.exports);