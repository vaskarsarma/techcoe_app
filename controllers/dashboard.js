var express = require("express");
var router = express.Router();
module.exports = router;

router.get("/", function(req, res) {
    // console.log("userregistration");
    console.log("dashboard");
    res.render('dashboard');
});