var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');

passport.use(new LocalStrategy(function(username, password, done) {

    db.get().collection('users').findOne({ name: username }, function(err, user) {

        if (err || user == undefined) {
            return done(null, false);
        } else {
            if (!user || user.name !== username) {
                return done(null, false); //, { message: 'Incorrect username.' });
            }

            if (!user || user.password !== password) {
                return done(null, false); //, { message: 'Incorrect password.' });
            }

            return done(null, user);
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});