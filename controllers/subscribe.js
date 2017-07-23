var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer');
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');

module.exports = router;

router.get('/', function(req, res) {
    var path = "Thanks for subscribing !!";
    var mailOptions = {
        from: 'nodegitapp@gmail.com',
        to: req.query.emailID,
        subject: 'Subscribe user for node app',
        text: path
    };

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodegitapp@gmail.com',
            pass: 'Node@123'
        }
    });

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("error: " + error);
            res.json(false);
        } else {
            console.log("success sendMail");
            var filter = { "name": req.query.name, "emailID": req.query.emailID, "dateTime": new Date().toDateString() };
            console.log("step 1");
            db.Insert("subscribeUser", filter).then(function(info) {
                //console.log("err:" + JSON.stringify(err));
                res.json(true);
                console.log("Insert info:" + JSON.stringify(info));
            }).catch(function(error) {
                res.json(false);
            });
        }
    });

    //  res.json("ankit");
});