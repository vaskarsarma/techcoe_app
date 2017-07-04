var express = require("express");
var router = express.Router();
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
var bcrypt = require('bcrypt');
var Moniker = require('moniker');
var names = Moniker.generator([Moniker.noun]);
// var nodemailer = require('nodemailer');

module.exports = router;

router.get("/userregistration", function(req, res) {
    // console.log("userregistration");
    console.log(names.choose());
    res.render('userregistration');
});


router.post("/userregistration", function(req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var admin = req.body.admin ? "checked" : "";
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'email field is required').notEmpty();
    req.checkBody('email', 'email is not valid').isEmail();
    req.checkBody('password', 'password field is required').notEmpty();
    req.checkBody('password2', 'confirm password field is required').notEmpty();
    req.checkBody('password2', 'password did not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        console.log("errors");
        res.render('userregistration', {
            errors: errors,
            username: username,
            name: name,
            email: email,
            password: password,
            password2: password2,
            admin: admin
        });
    } else {
        console.log("home");

        db.get().collection("users").save({
            "username": bcrypt.hashSync(username, 10),
            "name": name,
            "password": bcrypt.hashSync(password, 10),
            "admin": admin,
            "email": email
        }, (err, results) => {
            if (err) {
                console.log("Error in inseration");
                // res.status(500).send();
                res.render('userregistration', { title: 'Sign-up', IsError: true });
            } else {
                console.log("User inserted successfully");
                res.render('userregistration', { title: 'Sign-up', IsUpdated: true });
            }
        });
        //  res.redirect('/userregistration');
    }
    //var name=req.body.name;
    ///console.log("ankit1");

});