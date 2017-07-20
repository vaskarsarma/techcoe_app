var express = require("express");
var router = express.Router();
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');

module.exports = router;

router.get("/data/GetTradingBlogs", function(req, res) {

    var filter = { "categorykey": true, "_id": false };
    db.find("blogs", filter).then(function(results) {
        //  console.log("blogs Res:" + JSON.stringify(results));
        // res.render('dashboard', { collectionCountList: collectionCountList });
        res.json(results);
    });

});

router.get("/data/validateTickets", function(req, res) {

    // var commentFilter = { "categorykey": true, "_id": false };
    // var userFilter = { "categorykey": true, "_id": false };
    // Promise.all([db.findAllCount("users"), db.findAllCount("subscribeUser")]).then(data => {
    //     console.log(data);
    //     collectionCountList.userCount = data[0];
    //     collectionCountList.subscribeUser = data[1];
    // }).then(function() {
    //     collectionCountList.TotalVisitor = 0;
    //     collectionCountList.totalCategory = blogs.category.length;
    //     //console.log("collectionCountList.totalCategory :" + collectionCountList.totalCategory);
    //     // console.log("userregistration");
    //     // console.log("dashboard");
    //     console.log("dashboard end");
    //     res.render('dashboard', { layout: 'dashboardlayout', collectionCountList: collectionCountList });
    // });


    // db.find("comments", filter).then(function(results) {
    //     //  console.log("blogs Res:" + JSON.stringify(results));
    //     // res.render('dashboard', { collectionCountList: collectionCountList });
    //     res.json(results);
    // });

});