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
    // var resultArray = {
    //     EmailId: [],
    //     Hash: []
    // };

    // db.connect(url, function(err, db) {
    //     var cursor = db.collection('users').findOne({ email: req.body.emailID });
    //     console.log("cursor:" + cursor != null);
    //     db.close();
    //     //   cursor.forEach(function(doc, err) {
    //     //      resultArray.users.push(doc);
    //     //   }, function() {
    //     //      db.close();
    //     //      res.render('forgotpwd', { emailNotFound: true, showForm: true });
    //     //   });

    //     var colors = db.collection('hash').find();
    //     console.log("hash:" + colors != null);
    //     db.close();
    //     //   colors.forEach(function(doc,err){
    //     //       resultArray.colors.push(doc);
    //     //    }, function() {
    //     //      db.close();
    //     //      res.render('profile/index', {users: resultArray.users, colors: resultArray.colors});
    //     //   });
    // });

    db.get().collection('users').findOne({ email: req.body.emailID }, function(err, info) {
        console.log("step 2 : " + info.username);
        if (err || info == null) {
            console.log("step 3");
            res.render('forgotpwd', { emailNotFound: true, showForm: true });
        } else {
            console.log("step 4");
            var salt = null,
                hash = null,
                path = null;
            // console.log("hash1:" + db.hash());
            // res.render('forgotpwd', { emailNotFound: false, showForm: false });
            // res.render('bloggers', { title: 'Blogs', selectedBlogForEdit: true, category: categoryList, blogs: info });
            db.get().collection('salt').findOne({}, function(err, data) {
                if (err || info == null) {
                    // console.log("step 3.1");
                    res.render('forgotpwd', { errorToSendEmail: true, emailNotFound: true, showForm: true });
                } else {
                    salt = data.salt;
                    //console.log("salt1:" + salt);

                    console.log("salt:" + salt);
                    if (salt != null)
                        hash = bcrypt.hashSync(info.username, salt);

                    console.log("hash:" + hash);
                    path = "http://localhost:1337/auth/reset?id=" + hash;
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


});