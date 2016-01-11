(function(){
app = angular.module('bibleApp',[]);

var bibleController = function($http,$sce,$q){
console.log('angular ready to rumble')
var bible = this;
bible.IsLoadingVerses=false;
    bible.IsOnFullSearch=false;

 bible.renderHtml = function (htmlCode) {

     debugger;
            return $sce.trustAsHtml(htmlCode);
        };
bible.ListVerses = function(chapter){
    console.log(chapter);
    var requestQ = [];
    bible.selectedChapter = chapter;
    bible.selectedChapter.verses = [];
    _resetWordCountVars();
    var getVerseRequest =getVerses(chapter.id,function(result){

        bible.selectedChapter.verses = result.data.response.verses;
    });
    requestQ.push(getVerseRequest);

    $q.all(requestQ).then(function(values){

        bible.IsLoadingVerses = false;
        requestQ.push = [];
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

    }
bible.searchWholeBook = function(){
    bible.selectedChapter = {};
    bible.selectedChapter.verses = [];
    var requestQ = [];
    bible.IsOnFullSearch = true;
    _resetWordCountVars();
    bible.selectedBook.chapters.forEach(function(chapter){

   var getVerseRequest = getVerses(chapter.id,function(result){
            var verses = result.data.response.verses;
            verses.forEach(function(verse){

                if(verse.text.toUpperCase().includes(bible.searchTextInBook.toUpperCase())){

                    bible.wordCount ++;
                    verse.text = verse.text.replace(bible.searchTextInBook,"<b>"+bible.searchTextInBook.toUpperCase()+"</b>")
                    bible.selectedChapter.verses.push(verse);

                }
            });

        });

        requestQ.push(getVerseRequest);
    });

    $q.all(requestQ).then(function(values){
        bible.foundWords = "La palabra "+bible.searchTextInBook + " Se encontro " + bible.wordCount +" Veces";
        bible.IsLoadingVerses = false;
        bible.IsOnFullSearch = false;
        requestQ.push = [];
    });
};




$http.get('/api/books').then(function(result){
bible.books = result.data.response.books;
    bible.selectedBook = bible.books[0];
debugger;

})




};



app.controller('bibleController',bibleController);


})()