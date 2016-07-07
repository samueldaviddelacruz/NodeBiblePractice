/**
 * Created by Samuel on 7/7/2016.
 */
((ViewsRequestHandler)=>{

    ViewsRequestHandler.onGetBibleView  = (nodeRequest,nodeResponse) =>{
        var loggedUser = nodeRequest.user;
        nodeResponse.render("bible",getViewObject('Bible!',loggedUser));
    };
    
    ViewsRequestHandler.onGetMyFavoriteVersesView  = (nodeRequest,nodeResponse) =>{
        var loggedUser = nodeRequest.user;
        nodeResponse.render("FavoriteVerses",getViewObject('My Verses!',loggedUser));
    };
   
    var getViewObject = (title,user) =>{
        return {
            title:title,
            user:user
        };
    }




})(module.exports)