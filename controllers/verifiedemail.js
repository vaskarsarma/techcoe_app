var express = require("express");
var router = express.Router();
module.exports = router;
var ObjectId = require("mongodb").ObjectID;

var configparam = require("../data/configparam.json");

router.get('/', function(req, res) {

    console.log("i " + req.query.i + " ,  ts " + req.query.ts);

    var currentDT = new Date(new Date().toISOString());
    var verifedEmailSentDT = new Date(req.query.ts);

    console.log("currentDT " + currentDT + " , verifedEmailSentDT " + verifedEmailSentDT);

    var diffDT = currentDT - verifedEmailSentDT;

    console.log(Math.floor(diffDT / 1e3), ' seconds ago');

    if (Math.floor(diffDT / 1e3) < parseInt(configparam.emailverificationgap)) {

        var filter = { "_id": ObjectId(req.query.i) };

        console.log(JSON.stringify(filter));

        // db.findOne('users', filter).then(function(results) {
        //     if (results._id != undefined) {
        //         filter = { "_id": ObjectId(results._id) };

        //         var updateQuery = {
        //             "IsEmailVerified": true
        //         };

        //         db.get().collection("users").update(filter, {
        //             $set: updateQuery
        //         }, { upsert: false }, (err, results) => {
        //             if (err) {
        //                 res.status(500).send();
        //             } else {
        //                 console.log("Email id is verified successfully");
        //                 res.render('emailverified', { layout: 'default', title: 'Email Verification Page' });
        //             }
        //         });
        //     }
        // }).catch(function(err) {
        //     console.log("email verification " + err);
        //     res.status(500).send();
        // });
        res.send("email verified");
    } else {
        res.send("email not verified");
    }
});