(function(){
app = angular.module('bibleApp',[]);

var bibleController = function($http,$sce,$q,$timeout){
console.log('angular ready to rumble');
var bible = this;
    bible.IsLoadingVerses=false;
    bible.IsOnFullSearch=false;

 bible.renderHtml = function (htmlCode) {

     debugger;
            return $sce.trustAsHtml(htmlCode);
        };
bible.ListVerses = function(chapter){
    console.log(chapter);
    //added a requests array to q and execute all requests
    var requestQ = [];
    bible.selectedChapter = chapter;
    bible.selectedChapter.verses = [];
    _resetWordCountVars();
    var getVerseRequest =getVerses(chapter.id,function(result){

        bible.selectedChapter.verses = result.data.response.verses;
    });
    //push http request into array
    requestQ.push(getVerseRequest);
//send array to $q to execute all http requests, then do something after they are all complete
    $q.all(requestQ).then(function(){

        bible.IsLoadingVerses = false;
        requestQ = [];
    });


};
//Dios

    var getVerses = function(chapterId,callback){

        bible.IsLoadingVerses = true;

        return $http.get('/api/verses/'+chapterId).then(callback);

    };
    var _resetWordCountVars =function(){
        bible.wordCount = 0;
        bible.foundWords = null;

    };
bible.searchWholeBook = function(){
    if(bible.searchTextInBook) {
    bible.selectedChapter = {};
    bible.selectedChapter.verses = [];
    //added a requests array to q and execute all requests
    var requestQ = [];
    bible.IsOnFullSearch = true;
    _resetWordCountVars();

        bible.selectedBook.chapters.forEach(function (chapter) {

            var getVerseRequest = getVerses(chapter.id, function (result) {
                var verses = result.data.response.verses;
                verses.forEach(function (verse) {

                    if (verse.text.toUpperCase().includes(bible.searchTextInBook.toUpperCase())) {

                        bible.wordCount++;
                        verse.text = verse.text.replace(bible.searchTextInBook, "<b>" + bible.searchTextInBook.toUpperCase() + "</b>");
                        bible.selectedChapter.verses.push(verse);

                    }
                });

            });
//push http request into array
            requestQ.push(getVerseRequest);
        });
//send array to $q to execute all http requests, then do something after they are all complete
        $q.all(requestQ).then(function () {
            bible.foundWords = "La palabra " + bible.searchTextInBook + " Se encontro " + bible.wordCount + " Veces";
            bible.IsLoadingVerses = false;
            bible.IsOnFullSearch = false;
            requestQ.push = [];
        });
    }
};

    bible.addToFavoriteVerses= function (verse){
        console.log(verse);
        $http.post('/api/addToFavorite',{verseId :verse.id, reference:verse.reference}).then(function(){
            debugger;
            bible.VerseAdded = true;
           $timeout(function(){
//alert('test');
                bible.VerseAdded = false;
            },3000)


        });


    };



    


$http.get('/api/books').then(function(result){
bible.books = result.data.response.books;
    bible.selectedBook = bible.books[0];
debugger;

});




};
var accountController = function($http,$sce){
    var account = this;
    account.MyFavoriteVerses = [];
    account.renderHtml = function (htmlCode) {
        debugger;
        return $sce.trustAsHtml(htmlCode);
    };

    $http.get('/api/getMyVerses').then(function(result){

        console.log(result);

        result.data.MyFavoriteVerses.forEach(function(verse){

            $http.get('/api/getSingleVerse/'+verse.verseId).then(function(result){
                debugger;
                account.MyFavoriteVerses.push(result.data.response.verses[0]);

            });

        });



    });


    account.removeFromFavorites = function (verse){
        //alert('hey');
        console.log(verse);
        $http.post('/api/removeFromFavorites',{verseId :verse.id, reference:verse.reference}).then(function(){
            debugger;
            account.VerseRemoved = true;
            $timeout(function(){
//alert('test');
                account.VerseRemoved = false;
            },3000)

        });

    };



};


    app.controller('bibleController',bibleController);

    app.controller('accountController',accountController);
})();