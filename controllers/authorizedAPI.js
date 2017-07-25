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
    var commentFilter = { "IsApproved": true, "_id": false };
    db.find("comments", commentFilter).then(function(results) {
        res.json(results);
    });
});

router.get("/data/DashboardUserInfo", function(req, res) {
    var commentFilter = { "password": false, "usernamehash": false, "_id": false };
    db.find("users", commentFilter).then(function(results) {
        res.json(results);
    });
});

router.get("/data/DashboardUserGraphInfo", function(req, res) {
    // console.log("DashboardBlogsInfo start");
    var userFilter = { "password": false, "usernamehash": false, "_id": false };
    var subscribeUserFilter = { "dateTime": true, "_id": false };
    var collectionCountList = {};
    Promise.all([db.find("users", userFilter), db.find("subscribeUser", subscribeUserFilter)]).then(data => {
        collectionCountList.userData = data[0];
        collectionCountList.subscribeUserData = data[1];
        res.json(collectionCountList);
    });
});

router.post("/data/DashboardUsertable", function(req, res) {

    var type = req.params.type;
    if (type != null) {
        console.log("table1:" + req.body.type);
        var commentFilter = {};
        switch (type) {
            case "total":
                commentFilter = { "_id": false };
                // execute code block 1
                break;
            case "admin":
                commentFilter = { "_id": false };
                // execute code block 2
                break;
            case "active":
                commentFilter = { "_id": false };
                // execute code block 2
                break;
            case "deactive":
                commentFilter = { "_id": false };
                // execute code block 2
                break;
            case "email":
                commentFilter = { "_id": false };
                // execute code block 2
                break;
        }
        db.find("users", commentFilter).then(function(results) {
            res.json(results);
        });
    }
    // var commentFilter = { "password": false, "usernamehash": false, "_id": false };
    // db.find("users", commentFilter).then(function(results) {
    //     res.json(results);
    // });
    res.json("true");
});