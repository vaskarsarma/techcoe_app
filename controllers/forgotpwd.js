var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');

module.exports = router;

router.get("/forgotpwd", function(req, res) {
    console.log("forgotpwd");
    res.render('forgotpwd', { showForm: true });
});


router.post("/forgotpwd", function(req, res) {

    var emailID = req.body.emailID;
    req.checkBody('emailID', 'Email ID is required').notEmpty();
    req.checkBody('emailID', 'Email is not valid').isEmail();
    var errors = req.validationErrors();

    if (errors) {
        console.log("errors found");
        res.render('forgotpwd', { errors: errors, emailID: emailID, showForm: true });
        // res.render('forgotpwd', {
        //     errors: errors,
        //     emailID: emailID
        // });
    } else {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nodegitapp@gmail.com',
                pass: 'Node@123'
            }
        });
        console.log("step 1.1");
        db.get().collection('users').findOne({ email: req.body.emailID }, function(err, info) {
            //console.log("step 2 : " + info.username);
            if (err || info == null) {
                console.log("step 3");
                res.render('forgotpwd', { emailNotFound: true, showForm: true });
            } else {
                console.log("step 4");
                var salt = null,
                    hash = null,
                    path = null;
                db.get().collection('salt').findOne({}, function(err, data) {
                    if (err || info == null) {
                        // console.log("step 3.1");
                        res.render('forgotpwd', { errorToSendEmail: true, emailNotFound: true, showForm: true });
                    } else {
                        salt = data.salt;
                        //console.log("salt1:" + salt);

                        console.log("info.usernamehash:" + info.usernamehash);
                        // if (salt != null)
                        //     hash = bcrypt.hashSync(info.username, salt);

                        console.log("hash:" + hash);
                        path = "http://localhost:1337/auth/reset?id=" + info.usernamehash;
                        var mailOptions = {
                            from: 'nodegitapp@gmail.com',
                            to: req.body.emailID,
                            subject: 'Pasword reset request',
                            text: path
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log("step 5");
                                console.log("error: " + error);
                                res.render('forgotpwd', { errorToSendEmail: true, emailNotFound: false, IsEmailSend: false, showForm: true });
                            } else {
                                console.log("step 6");
                                res.render('forgotpwd', { emailNotFound: false, IsEmailSend: true, showForm: false });
                            }
                        });
                    }
                });


                //res.render('login');
            }
        });
    }

});