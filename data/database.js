( (database) =>{

    var mongodb = require("mongodb");
    var mongoUrl = "mongodb://ingsamy:mega007@ds059519.mongolab.com:59519/mongolabdb";
        

    var theDb = null;
    database.getDb =  (next)=>{
        if (!theDb) {
        //connecto the database

            mongodb.MongoClient.connect(mongoUrl,  (err,db) =>{
            
                if (err) {
                    next(err, null);
                } else {
                    theDb = {
                        db: db,
                        usuarios:db.collection("usuarios")
                    };
                    next(null, theDb);
                }
            })
        } else {

            next(null, theDb);
        }
    
    
    }

}
)(module.exports);