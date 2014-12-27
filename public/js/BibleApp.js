(function(){
app = angular.module('bibleApp',[]);

var bibleController = function($http,$sce){
console.log('angular ready to rumble')
var bible = this;


 bible.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
bible.ListVerses = function(chapter){

console.log('book selected')

$http.get('/api/verses/'+chapter.id).then(function(result){
chapter.verses = result.data.response.verses;
debugger;

})

}

$http.get('/api/books').then(function(result){
bible.books = result.data.response.books;
debugger;

})




}



app.controller('bibleController',bibleController);


})()