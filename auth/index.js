//'auth/index.js'
(function(auth) {
	var data = require('../data');
	var hasher = require('./hasher');
	var passport = require("passport");
	var localStrategy = require("passport-local").Strategy;


	function userVerify(username, password, next) {

		data.getUser(username, function(err, user) {

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

	auth.ensureAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) {


			next();

		} else {

			res.send(401, "Not authorized")

		}



	};

	auth.ensureApiAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) {


			next();

		} else {

			res.redirect("/login");

		}



	};

	auth.init = function(app) {
		//setup passport authentication
		passport.use(new localStrategy(userVerify));
		passport.serializeUser(function(user, next) {

			try {

				next(null, user.username);
				debugger
			}catch(err){
				console.log(err)

			}



		});



		passport.deserializeUser(function(key, next) {

			data.getUser(key, function(err, user) {
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
		app.get("/register", function(req, res) {
			if (req.user) {
				console.log('user logged in register page!');
				res.render("register", {
					title: "Registration",
					message: req.flash("registrationError"),
					user: req.user
				})
			} else {
				res.render("register", {
					title: "Registration",
					message: req.flash("registrationError")
				})

			}

		});

		app.get("/", function(req, res) {
			if (req.user) {
				console.log('user already in session :' + req.user.username);
				res.redirect('/bible')
			} else {
				res.render("login", {
					title: "Login",
					message: req.flash("loginError")
				})
			}


		});


		app.post("/register", function(req, res, next) {


			var salt = hasher.createSalt();

			var _newuser = {
				name: req.body.name,
				email: req.body.email,
				username: req.body.username.toUpperCase(),
				passwordHash: hasher.computeHash(req.body.password, salt),
				salt: salt,


			};

			data.getUser(_newuser.username,function (err,user){

				if(user){
					req.flash("registrationError",user.username + " User Already Exists" );
					res.redirect("/register")

				}else{
					console.log(_newuser);
					data.addUser(_newuser, function(err) {
						if (err) {
							console.log(err + 'sdsd');
							req.flash("registrationError", "Could Not save User to Database");
							res.redirect("/register")

						} else {


							var authFunction = passport.authenticate("local", function(err, user, info) {

								if (err) {
									next(err)
								} else {


									req.logIn(user, function(err) {
										if (err) {

											next(err)
										} else {
											res.redirect("/bible")

										}
									})
								}
							});

							authFunction(req, res, next)

						}


					})
				}

			});



		});







		app.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});




		app.post("/login", function(req, res, next) {
			var authFunction = passport.authenticate("local", function(err, user, info) {

				if (err) {
					res.render("login", {
						title: "Login",
						message: err
					});
					//next(err)
				} else {


					req.logIn(user, function(err) {
						if (err) {



							/*next le pasa el control a passport ( the next middleware)... pero passport no sabe que hacer
							 con el error so i wont pass the control to him in case the log in fails
							 next(err);
							 i will just redirect to the login view with a message of invalid username/pass
							 */
							res.render("login", {
								title: "Login",
								message: "Invalid Username/Password"
							});


						} else {
							res.redirect("/bible")

						}

					})
				}

			});


			authFunction(req, res, next);

		})


	}



})(module.exports);