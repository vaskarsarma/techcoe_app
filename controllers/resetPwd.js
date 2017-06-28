var express = require("express");
var router = express.Router();
// var nodemailer = require('nodemailer');
// var bcrypt = require('bcrypt');

module.exports = router;

router.get("/reset", function(req, res) {
    console.log("reset");
    res.render('reset');
});