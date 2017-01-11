//'auth/index.js'
(function(auth) {
	var data = require('../data');
	var hasher = require('./hasher');
	var passport = require("passport");
    var ViewsRequestHandler = require("../Request Handlers/Views.Handler")
    var localStrategy = require("passport-local").Strategy;


	function  userVerify(username, password, next) {

		data.getUser(username, (err, user) => {
			if (!err && user) {
				var testHash = hasher.computeHash(password, user.salt);

				if (testHash === user.passwordHash) {

					next(null, user);

				}else {
					next("Invalid Credentials", false, {
						message: "Invalid Credentials"
					});
				}

			} else {
				next(null, false, {
					message: "User Doesnt Exists"
				});
			}
		})
	}
	auth.ensureAuthenticated = (req, res, next) =>{
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect("/login");
		}
	};

	auth.ensureApiAuthenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
			next();
		} else {

			res.send(401, "Not authorized")
		}
	};

	auth.init = (app) => {
		//setup passport authentication
		passport.use(new localStrategy(userVerify));
		passport.serializeUser(( user, next) =>{

			try {

				next(null, user.username);
			
			}catch(err){
				console.log(err)

			}
		});
		passport.deserializeUser((key, next) =>{

			data.getUser(key, (err, user) =>{
				if (err) {
					next(null, false, {
						message: "failed to retrieve user"
					})

				} else {

					next(null, user);
				}

			})

		});

		app.use(passport.initialize());
		app.use(passport.session());
		app.get("/register", ViewsRequestHandler.onRegister);

		app.get("/", ViewsRequestHandler.onLogIn);


		app.post("/register", (req, res, next) =>{
			var newUser = getNewUserData(req);
			data.getUser(newUser.username, getOnGetUserCallback(req,res,next,newUser));
		});
        var getNewUserData = (req)=>{
            var salt = hasher.createSalt();
            return {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username.toUpperCase(),
                passwordHash: hasher.computeHash(req.body.password, salt),
                salt: salt
            };
        };
        var getOnGetUserCallback = (req, res, next,newUser) =>{
            return (err,user)=>{
                if(user){

                    req.flash("registrationError",user.username + "  ya esta en uso" );
                    res.redirect("/register");

                }else{
                    data.addUser(newUser, getOnAddUserCallback(req,res,next));
                }
            }
        };
        var getOnAddUserCallback = (req,res)=> {
            return (err) => {
                if (err) {
                    req.flash("registrationError", "Could Not save User to Database");
                    res.redirect("/register")
                }
                var authFunction = getAuthFunction(req, res);
                authFunction(req, res);

            }
        }


		app.get('/logout', ViewsRequestHandler.onLogOut);




		app.post("/login", (req, res, next) =>{
            var authFunction = getAuthFunction(req,res);
			authFunction(req, res, next);

		});


        var getAuthFunction = (req,res) =>{

            return passport.authenticate("local", getOnAuthCallback(req,res));
            
        };
        var getOnAuthCallback =(req,res) =>{
            return ViewsRequestHandler.getOnLoginHandler(req,res);
        } 
        

	}



})(module.exports);