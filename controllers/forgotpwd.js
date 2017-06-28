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
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodegitapp@gmail.com',
            pass: 'Node@123'
        }
    });
    console.log("step 1");
    db.get().collection('users').findOne({ email: req.body.emailID }, function(err, info) {
        console.log("step 2 : " + info);
        if (err || info == null) {
            console.log("step 3");
            res.render('forgotpwd', { emailNotFound: true, showForm: true });
        } else {
            console.log("step 4");
            // res.render('forgotpwd', { emailNotFound: false, showForm: false });
            // res.render('bloggers', { title: 'Blogs', selectedBlogForEdit: true, category: categoryList, blogs: info });

            var mailOptions = {
                from: 'nodegitapp@gmail.com',
                to: req.body.emailID,
                subject: 'Pasword reset request',
                text: 'http://localhost:1337/auth/reset'
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

            //res.render('login');
        }
    });


});