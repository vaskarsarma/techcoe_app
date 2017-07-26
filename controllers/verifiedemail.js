var express = require("express");
var router = express.Router();
module.exports = router;
var db = require("../models/db");
var ObjectId = require("mongodb").ObjectID;
var configparam = require("../data/configparam.json");

router.get('/', function(req, res) {

    var filter = { "userid": req.query.i };

    db.findOne('verifyemailtrigger', filter).then(function(results) {
        if (results != undefined && results._id != undefined) {

            var currentDT = new Date(new Date().toISOString());
            var verifedEmailSentDT = new Date(results.dt);

            var diffDT = currentDT - verifedEmailSentDT;

            if (Math.floor(diffDT / 1e3) < parseInt(configparam.emailverificationgap)) {

                filter = { "_id": ObjectId(req.query.i) };

                db.findOne('users', filter).then(function(results) {
                    if (results != undefined && results._id != undefined && !(results.IsEmailVerified)) {

                        filter = { "_id": ObjectId(results._id) };

                        var updateQuery = {
                            "IsEmailVerified": true
                        };

                        db.get().collection("users").update(filter, {
                            $set: updateQuery
                        }, { upsert: false }, (err, results) => {
                            if (err) {
                                res.status(500).send();
                            } else {
                                console.log("Email id is verified successfully");
                                res.render('emailverified', { layout: 'layout', title: 'Email Verification Page' });
                            }
                        });
                    } else {
                        res.render('emailverified', { layout: 'layout', title: 'Email Verification Page', isAlreadyUpdated: "true" });
                    }
                }).catch(function(err) {
                    console.log("email verification " + err);
                    //res.status(500).send();
                    res.render('emailverified', { layout: 'layout', title: 'Email Verification Page', isError: "true" });
                });
            } else {
                res.render('emailverified', { layout: 'layout', title: 'Email Verification Page', isError: "true" });
            }
        } else {
            res.render('emailverified', { layout: 'layout', title: 'Email Verification Page', isError: "true" });
        }
    }).catch(function(err) {
        console.log(err);
        res.render('emailverified', { layout: 'layout', title: 'Email Verification Page', isError: "true" });
    });
});