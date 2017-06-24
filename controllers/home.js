var express = require("express");
var router = express.Router();
module.exports = router;

//Get Home Page
router.get('/home', function(req, res) {
    res.render('home', { layout: 'layout', title: 'Home Page' });
});