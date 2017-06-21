var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer');

module.exports = router;

router.get("/forgotpwd", function(req, res) {
    console.log("forgotpwd");
    res.render('forgotpwd');
});

router.post("/forgotpwd", function(req, res) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodegitapp@gmail.com',
            pass: 'Node@123'
        }
    });

    var mailOptions = {
        from: 'nodegitapp@gmail.com',
        to: req.body.emailID,
        subject: 'Pasword reset request',
        text: 'That was easy!'
    };
    console.log(req.body.emailID);
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("error: " + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.render('login');
});