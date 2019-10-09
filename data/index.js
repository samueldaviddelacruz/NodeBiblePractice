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

      const user = await db.usuarios.findOne({
        username: username.toUpperCase()
      });

      let verses = [];
      for (const fav of user.MyFavoriteVerses) {
        const verse = await data.getBibleVerseById(fav.verseId);
        verses.push(verse);
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

      const books = await db.bibleBooks
        .find({}, { projection: { _id: 0 } })
        .toArray();

      return books;
    } catch (err) {
      throw err;
    }
  };

  data.getBibleBookById = async id => {
    try {
      const db = await database.getDb();

      const book = await db.bibleBooks.findOne(
        { id },
        { projection: { _id: 0 } }
      );

      return book;
    } catch (err) {
      throw err;
    }
  };

  data.getVersesByChapterNumber = async (bookId, chapterNumber) => {
    try {
      const book = await data.getBibleBookById(bookId);
      const chapter = book.chapters.find(c => c.chapter === chapterNumber);
      if (!chapter) {
        return [];
      }
      return await data.getBibleVersesByChapterId(chapter.id);
    } catch (err) {
      throw err;
    }
  };

  data.getVerseByChapterAndVerseNumber = async (bookId, verseRange) => {
    try {
      const [chapterNumber, verseNumber] = verseRange.split(":");
      const book = await data.getBibleBookById(bookId);
      const chapter = book.chapters.find(c => c.chapter === chapterNumber);
      const verseId = `${chapter.id}.${verseNumber}`;
      const result = await data.getBibleVerseById(verseId);

      return result || {};
    } catch (err) {
      throw err;
    }
  };

  data.getVersesFromChapterUntilVerse = async (bookId, verseRange) => {
    try {
      const [startChapterNumber, endChapterAndVerse] = verseRange.split("-");
      const [endChapterNumber, endVerseNumber] = endChapterAndVerse.split(":");

      const book = await data.getBibleBookById(bookId);
      let chaptersMap = book.chapters.reduce((acc, nextVal) => {
        return { ...acc, [nextVal.chapter]: nextVal };
      }, {});
      const startChapter = chaptersMap[`${startChapterNumber}`];
      const endChapter = chaptersMap[`${endChapterNumber}`];

      if (startChapter && endChapter) {
        const startChapterVerses = await data.getBibleVersesByChapterId(
          startChapter.id
        );
        const endChapterVerses = await data.getBibleVersesByChapterId(
          endChapter.id
        );
        const filteredVerses = endChapterVerses.filter((v, idx) => {
          let indx = idx + 1;
          return indx <= endVerseNumber;
        });

        return [...startChapterVerses, ...filteredVerses];
      }
    } catch (err) {
      throw err;
    }
  };
  data.getVersesFromVerseUntilChapter = async (bookId, verseRange) => {
    try {
      const [startChapterAndVerse, endChapter] = verseRange.split("-");
      const [startChapterNumber, startVerseNumber] = startChapterAndVerse.split(
        ":"
      );

      const book = await data.getBibleBookById(bookId);
      const bookChapters = book.chapters;
      let result = [];

      const chapterIsWithingRange = +endChapter <= bookChapters.length;
      if (chapterIsWithingRange) {
        let chaptersMap = bookChapters.reduce((acc, nextVal) => {
          return { ...acc, [nextVal.chapter]: nextVal };
        }, {});

        const firstBatchOfVerses = await data.getBibleVersesByChapterId(
          chaptersMap[startVerseNumber].id
        );
        const filteredStartingVerses = getVersesStartingAt(
          firstBatchOfVerses,
          startVerseNumber
        );

        result.push(...filteredStartingVerses);
        let chapterIdList = [];
        for (let i = +startChapterNumber + 1; i < +endChapter; i++) {
          const chapter = chaptersMap[`${i}`];
          if (chapter) {
            chapterIdList.push(chapter.id);
          }
        }
       
        const db = await database.getDb();

        const verses = await db.bibleVerses
          .find(
            { chapterId: { $in: chapterIdList } },
            { projection: { _id: 0 } }
          )
          .toArray();
        result.push(...verses);
      }

      return result;
    } catch (err) {
      throw err;
    }
  };

  data.getBibleVersesByChapterId = async id => {
    try {
      const db = await database.getDb();

      const versesByChapterId = await db.bibleVerses
        .find({ chapterId: id }, { projection: { _id: 0 } })
        .toArray();

      return versesByChapterId;
    } catch (err) {
      throw err;
    }
  };
  data.getBibleVerseById = async id => {
    try {
      const db = await database.getDb();

      const verse = await db.bibleVerses.findOne(
        { id },
        { projection: { _id: 0 } }
      );

      return verse;
    } catch (err) {
      throw err;
    }
  };
})(module.exports);
function getVersesStartingAt(verses, startVerseNumber) {
  return verses.filter((v, idx) => {
    let indx = idx + 1;
    return indx >= startVerseNumber;
  });
}
