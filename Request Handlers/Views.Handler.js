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


    ViewsRequestHandler.getOnLoginHandler = (nodeRequest,nodeResponse) =>{
        var onLoginHandler = (error, user) =>{
            if (error)
                nodeResponse.render("login",  nodeResponse.render("login",getErrorViewObject("Login",error)) );
            nodeRequest.logIn(user, (error) =>{
                if (error)
                    nodeResponse.render("login",getErrorViewObject("Login","Invalid Username/Password"));
                nodeResponse.redirect("/bible")
            })
        }
        return onLoginHandler;
    }
    var getViewObject = (title,user) =>{
        return {
            title:title,
            user:user
        };
    }

    var getErrorViewObject = (title,message) =>{
        return {
            title:title,
            message:message
        };
    }


    ViewsRequestHandler.onLogOut  = (nodeRequest,nodeResponse) =>{
        nodeRequest.logout();
        nodeResponse.redirect('/');
    };

})(module.exports)