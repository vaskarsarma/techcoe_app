var express = require("express");
var router = express.Router();

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
// var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

module.exports = router;

router.get("/reset", function(req, res) {
    // var id = req.params.id;
    // console.log("URL:" + req.url);
    // console.log("req.params: " + req.params);
    // console.log("ID: " + req.query.id);
    // bcrypt.hash("ankit", 10, function(err, hash) {
    //     // Store hash in your password DB. 
    //     console.log("hash:" + hash);
    // });

    db.get().collection('users').findOne({ username: req.query.id }, function(err, info) {
        console.log("test:" + info);
        if (err || info == null) {
            console.log("InValid user for reset");
            res.render('login');

        } else {
            console.log("valid user for reset");
            res.render('reset', { userID: req.query.id });
        }
    });
    // res.render('reset');
});

router.post("/reset", function(req, res) {
    //var id = req.params.CPwd;
    //console.log("post:" + req.params._id + " , cPwd:" + req.body.CPwd);
    db.get().collection('users').findOne({ username: req.query.id }, function(err, info) {
        console.log("Info:" + info);
        if (err || info == null) {
            //res.status(500).send();
            res.render('reset', { IsPasswordInValid: true, userID: req.query.id });
        } else {
            console.log("ID :" + req.query.id + " , NPwd:" + req.body.NPwd);
            bcrypt.compare(req.body.CPwd, info.password, function(err, result) {
                if (result) {
                    console.log("password match");
                    bcrypt.hash(req.body.NPwd, 10, function(err, hash) {
                        console.log("hash:" + hash);
                        db.get().collection("users").update({ username: req.query.id }, {
                            $set: {
                                "password": hash
                            }
                        }, (err, results) => {
                            if (err) {
                                console.log("Error in Password updation ");
                                //res.status(500).send();
                                res.render('reset', { title: 'Reset Password', IsError: true, userID: req.query.id });
                            } else {
                                console.log("Password updated Successfully");
                                res.render('reset', { title: 'Reset Password', IsPasswordUpdated: true, userID: req.query.id });
                            }
                        });
                    });

                } else {
                    console.log("password didn't match");
                    res.render('reset', { title: 'Reset Password', IsPasswordInValid: true, userID: req.query.id });
                }
            });
            //console.log("test");
            // res.render('reset', { title: 'Rest Password', users: info });
            // res.render('edituser', { title: 'Edit User', users: info });
        }
    });

    //  res.render('reset');
});