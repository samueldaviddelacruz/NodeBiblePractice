(function () {
    debugger;
    var app = angular.module('bibleApp',[]);

    var bibleController = function ($http, $sce, $q, $timeout,$scope) {
        console.log('angular ready to rumble');
        //sa
        var bible = this;
        bible.IsLoadingVerses = false;
        bible.IsOnFullSearch = false;
        let versesCache = [];
        (async ()=>{

        bible.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
        bible.ListVerses =  async (chapter) =>{

            bible.selectedChapter = chapter;
            bible.selectedChapter.verses = [];
            _resetWordCountVars();

            bible.selectedChapter.verses = await getVerses2(chapter.id);
            bible.IsLoadingVerses = false;
            $scope.$apply();

        };
//Dios


            const getVerses = async  (chapterId) => {

                bible.IsLoadingVerses = true;
                if(isOnVersesCache(chapterId)){
                    return versesCache[`${bible.searchTextInBook}":"${chapterId}`];
                };
                let result = await $http.get('/api/verses/' + chapterId);
                let verses = result.data.response.verses;
                versesCache[`${bible.searchTextInBook}":"${chapterId}`] = verses;
                return verses;
            };
            const isOnVersesCache =(chapterId)=>{
                return versesCache[`${bible.searchTextInBook}":"${chapterId}`] !== undefined;
            };



        var _resetWordCountVars = function () {
            bible.wordCount = 0;
            bible.foundWords = null;

        };


        bible.searchWholeBook = async () => {
            if (bible.searchTextInBook) {

                bible.selectedChapter = {};
                bible.selectedChapter.verses = [];

                bible.IsOnFullSearch = true;
                _resetWordCountVars();

                debugger;

                let chapters = bible.selectedBook.chapters;
                for(let chapter of chapters){

                    let verses = await getVerses(chapter.id);

                    addAndUpdateSearchedVerses(verses)
                }

                bible.foundWords = "La palabra " + bible.searchTextInBook + " Se encontro " + bible.wordCount + " Veces";
                bible.IsLoadingVerses = false;
                bible.IsOnFullSearch = false;
                debugger;
                $scope.$apply();
            }
        };
            const addAndUpdateSearchedVerses = (verses)=>{
                for(let verse of verses){

                    if (verse.text.toUpperCase().includes(bible.searchTextInBook.toUpperCase())) {

                        bible.wordCount++;
                        verse.text = verse.text.replace(bible.searchTextInBook, "<b>" + bible.searchTextInBook.toUpperCase() + "</b>");
                        bible.selectedChapter.verses.push(verse);

                    }
                }
            };

        bible.addToFavoriteVerses = async function (verse) {
            await addToFavorite(verse,$http);
            bible.VerseAdded = true;
            $scope.$apply();
            $timeout( () => {
                bible.VerseAdded = false;
                $scope.$apply()
            }, 3000)
        };


            bible.books = await getBooks($http);
            bible.selectedBook = bible.books[0];
            $scope.$apply()
        })();

        console.log("sdsdsd")
    };
const addToFavorite = async (verse,$http) =>{
    return await $http.post('/api/addToFavorite', {verseId: verse.id, reference: verse.reference});
};

const getBooks = async ($http) => {
    let result = await $http.get('/api/books');
    return result.data.response.books;
};


    var accountController = function ($http, $sce) {
        var account = this;

        account.renderHtml = function (htmlCode) {
            debugger;
            return $sce.trustAsHtml(htmlCode);
        };
        function getMyVerses() {

            $http.get('/api/getMyVerses').then(function (result) {

                console.log(result);
                account.MyFavoriteVerses = [];
                result.data.MyFavoriteVerses.forEach(function (verse) {

                    $http.get('/api/getSingleVerse/' + verse.verseId).then(function (result) {
                        debugger;
                        account.MyFavoriteVerses.push(result.data.response.verses[0]);

                    });

                });


            });


        }


        account.removeFromFavorites = function (verse) {
            //alert('hey');
            console.log(verse);
            $http.post('/api/removeFromFavorites', {verseId: verse.id, reference: verse.reference}).then(function () {
                getMyVerses();


            });

        };


        getMyVerses();
    };


    app.controller('bibleController', bibleController);

    app.controller('accountController', accountController);
})();