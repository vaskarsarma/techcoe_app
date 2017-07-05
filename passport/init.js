var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
var bcrypt = require('bcrypt');

passport.use(new LocalStrategy(function(username, password, done) {

    // console.log("User name: " + username + " , user name hash:" + bcrypt.hashSync(username, 10));
    db.get().collection('users').findOne({ username: username }, function(err, user) {
        if (err || user == undefined) {
            console.log("user not found");
            return done(null, false); //'Incorrect username.'
        } else {

            //bcrypt.hashSync(username, 10)
            console.log("user found");
            bcrypt.compare(password, user.password, function(err, result) {
                if (result) {
                    console.log("user pwd match");
                    return done(null, user);
                } else {
                    console.log("user pwd did not match");
                    return done(null, false); //, { message: 'Incorrect password.' });
                }
            });
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});