var express = require("express");
var router = express.Router();
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');

module.exports = router;

router.get("/data/GetTradingBlogs", function(req, res) {

    var filter = { "categorykey": true, "_id": false };
    db.find("blogs", filter).then(function(results) {
        res.json(results);
    });

});

router.get("/data/DashboardBlogsInfo", function(req, res) {
    console.log("DashboardBlogsInfo start");
    var commentFilter = { "IsApproved": true, "_id": false };
    // var userFilter = { "categorykey": true, "_id": false };   
    db.find("comments", commentFilter).then(function(results) {
        console.log("DashboardBlogsInfo end ;" + results);
        res.json(results);
    });
});