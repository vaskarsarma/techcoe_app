var express = require("express");
var router = express.Router();
module.exports = router;

//Get Home Page
router.get('/', function(req, res) {
    res.render('bloggers', { layout: 'layout', title: 'Blogs' });
});

//================== Save Data =================
router.post("/savedata", function(req, res) {
    console.log("Topic " + req.body.topic);
    console.log("content " + req.body.content);
    console.log("Topic " + req.body.userid);
    res.send("save blog");
});