( (database) =>{

    var mongodb = require("mongodb");

    var mongoUrl = "mongodb://yourusername:yourpassword@yourmongoinstance/yourdb";

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