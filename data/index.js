(data => {
  const database = require("./database");

  data.getUser = async username => {
    try {
      const db = await database.getDb();

      const user = await db.usuarios.findOne({
        username: username.toUpperCase()
      });

      return user;
    } catch (err) {
      throw err;
    }
  };

  data.addUser = async user => {
    try {
      const db = await database.getDb();
      return await db.usuarios.insert(user);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  data.addToFavorite = async (username, verseData, next) => {
    try {
      const db = await database.getDb();
      db.usuarios.update(
        { username: username },
        { $addToSet: { MyFavoriteVerses: verseData } },
        next
      );
    } catch (err) {
      next(err);
    }
  };

  data.removeFromFavorites = async (username, verseData) => {
    try {
      const db = await database.getDb();
      await db.usuarios.update(
        { username: username },
        { $pull: { MyFavoriteVerses: verseData } }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  data.getFavoriteVerses = async (username, next) => {
    try {
      const db = await database.getDb();

      const user = await db.usuarios.findOne(
        {
          username: username.toUpperCase()
        }
      );
      
      let verses = []
      for (const fav of user.MyFavoriteVerses) {
        const verse = await data.getBibleVerseById(fav.verseId)
        verses.push(verse)
      }
      
      return verses;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  data.getBibleBooks = async () => {
    try {
      const db = await database.getDb();

      const books = await db.bibleBooks.find({},{ projection: { _id: 0 } }).toArray();

      return books;
    } catch (err) {
      throw err;
    }
  };
  data.getBibleVersesByChapterId = async (id) => {
    try {
      const db = await database.getDb();

      const versesByChapterId = await db.bibleVerses.find({chapterId:id},{ projection: { _id: 0 } }).toArray();

      return versesByChapterId;
    } catch (err) {
      throw err;
    }
  };
  data.getBibleVerseById = async (id) => {
    try {
      const db = await database.getDb();

      const verse = await db.bibleVerses.findOne({id},{ projection: { _id: 0 } });

      return verse;
    } catch (err) {
      throw err;
    }
  };
})(module.exports);
