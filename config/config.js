const keys = require('./keys')
const getConfig = () => {
  if (process.env.MONGO_URL && process.env.DB_NAME) {
    return {
      mongoDatabase: {
        mongoUrl: process.env.MONGO_URL,
        dbName: process.env.DB_NAME
      }
    };
  }
  
  return keys
};

module.exports = getConfig()
