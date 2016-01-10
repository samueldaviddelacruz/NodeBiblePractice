(function(){
app = angular.module('bibleApp',[]);

var bibleController = function($http,$sce){
console.log('angular ready to rumble')
var bible = this;
bible.IsLoadingVerses=false;

 bible.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
bible.ListVerses = function(chapter){
bible.selectedChapter = chapter;
console.log('Chapter selected');

    bible.IsLoadingVerses = true;
$http.get('/api/verses/'+chapter.id).then(function(result){
    bible.selectedChapter.verses = result.data.response.verses;
    bible.IsLoadingVerses = false;
})

}

$http.get('/api/books').then(function(result){
bible.books = result.data.response.books;
    bible.selectedBook = bible.books[0];
debugger;

})




};



app.controller('bibleController',bibleController);


})()