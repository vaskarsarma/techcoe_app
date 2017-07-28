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

    var type = req.body.type;

    if (type != null) {
        dataFilter = { "usernamehash": false, "password": false };
        var whereFilter = {};
        switch (type) {
            case "admin":
                whereFilter = { "admin": true };
                break;
            case "active":
                whereFilter = { "active": true };
                break;
            case "deactive":
                whereFilter = { "active": false };
                break;
            case "email":
                whereFilter = { "IsEmailVerified": false };
                break;
        }

        db.find("users", dataFilter, whereFilter).then(function(results) {
            res.json(results);
        });
    } else
        res.json(false);
});

router.post("/data/UpdateTableRecords", function(req, res) {
    if (req.body.id != null) {
        var filterQuery = { "_id": ObjectId(req.body.id) };
        var updateQuery = {
            "IsEmailVerified": (req.body.email === 'true'),
            "active": (req.body.active === 'true'),
            "admin": (req.body.admin === 'true')
        };
        db.update("users", filterQuery, updateQuery).then(function(results) {
            res.json(results);
        });
    } else
        res.json(false);
});