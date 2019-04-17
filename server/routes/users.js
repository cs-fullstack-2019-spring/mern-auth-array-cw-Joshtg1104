var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('../models/UserSchema');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
        done(err, user);
    });
});

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
};

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

router.get('/', (req, res, next) => {
    console.log("Home page");
    console.log(req.session);
    console.log(req.session.username);

    if (req.session.username) {
        res.send(req.session.username);
    } else {
        res.send(null);
    }
});


router.get('/logout', (req, res, next) => {
    console.log(req.session);

    if (req.session) {
        console.log("has session");
        req.session = null;
        res.send("Logged Out");
    } else {
        console.log("Doesn't have session");
        res.send("Not logged in");
    }
});


//******************************************************************
// ***************   Check if a user exists    *********************
//******************************************************************

// This is the "strategy" for checking for an existing user
passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log("Local Strat");
        Users.findOne({username: username}, function (err, user) {
            if (err) {
                console.log("1");
                return done(err);
            }
            if (!user) {
                console.log("2");
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (!isValidPassword(user, password)) {
                console.log("3");
                return done(null, false, {message: 'Incorrect password.'});
            }
            console.log("4");
            console.log(user);
            return done(null, user, {user: user.username});
        });
    }
));

// This is the route to check for new users
router.post('/login',
    passport.authenticate('local',
        {failureRedirect: '/users/loginfail'}),
    function (req, res) {
        req.session.username = req.body.username;
        console.log("Saving cookie");
        res.send(req.body.username);
    });

// If there is a successful check of an existing user
router.get('/loginsuccess', (req, res) => {
    res.send("Successful Logging in!!!")
});

// If there is a failure check of an existing user
router.get('/loginfail', (req, res) => {
    res.send(undefined)
});

//******************************************************************
// ***************   Registering / Sign up new User   **************
//******************************************************************

// This is the "strategy" for signing up a new user
passport.use('signup', new LocalStrategy(
    {passReqToCallback: true},
    function (req, username, password, done) {
        console.log("0");
        findOrCreateUser = function () {
            Users.findOne({'username': username}, function (err, user) {
                if (err) {
                    console.log("1");
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log("2");
                    console.log('User already exists');
                    return done(null, false,
                        {message: 'User already exists.'}
                    );
                } else {
                    console.log("3");
                    // if there is no user with that email
                    // create the user
                    var newUser = new Users();
                    newUser.username = username;
                    newUser.password = createHash(password);

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log("4");
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newUser);
                    });
                }
            });
        };

        process.nextTick(findOrCreateUser);
    })
);

// This is the route to create a new user.
router.post('/newuser',
    passport.authenticate('signup',
        {
            successRedirect: '/users/successNewUser',
            failureRedirect: '/users/failNewUser'
        }
    ),
    function (req, res) {
        console.log("test");
        res.send('Authenticated!');
    });

router.get('/successNewUser', (req, res) => {
    console.log(req.body);
    res.send("Added New User")
});

router.get('/failNewUser', (req, res) => {
    console.log("Failed New User");
});

router.get('/grabBook', (req, res) => {
    Users.findOne({username: req.session.username}, (errors, results) => {
        if (results) {
            return res.send(results);
        }
        else {
            return res.send({message: "Didn't find a user!!!"})
        }
    })
});

// This is from fetch '/users/addBook' run from the client side as a post.
router.post('/addBook', (req, res) => {
    Users.findOneAndUpdate({username: req.body.username},
        {$push: {book: req.body.bookEntry}}, (errors, results) => {
            if (errors) res.send(errors);
            else res.send("ADDED!!!");
        });
});

// ******************************************
// ******   How to protect routes   *********
// ******************************************

/* GET Home Page */
// router.get('/home', isAuthenticated, function(req, res){
//     res.render('home', { user: req.user });
// });
//
// // As with any middleware it is quintessential to call next()
// // if the user is authenticated
// var isAuthenticated = function (req, res, next) {
//     if (req.isAuthenticated())
//         return next();
//     res.redirect('/');
// }


module.exports = router;
