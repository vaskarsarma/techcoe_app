var express = require("express");
var router = express.Router();
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
var blogs = require('../models/blogs');

module.exports = router;



router.get("/", function(req, res) {
    console.log("dashboard start");
    var collectionCountList = {};

    Promise.all([db.findAllCount("users"), db.findAllCount("subscribeUser")]).then(data => {
        console.log(data);
        collectionCountList.userCount = data[0];
        collectionCountList.subscribeUser = data[1];
    }).then(function() {
        collectionCountList.TotalVisitor = 0;
        collectionCountList.totalCategory = blogs.category.length;
        //console.log("collectionCountList.totalCategory :" + collectionCountList.totalCategory);
        // console.log("userregistration");
        // console.log("dashboard");
        console.log("dashboard end");
        res.render('dashboard', { collectionCountList: collectionCountList });
    });


    // db.findAllCount("users").then(function(count) {
    //     console.log("findAllCount users count:" + count);
    //     collectionCountList.userCount = count;
    //     console.log("collectionCountList.userCount :" + collectionCountList.userCount);


    // }).then(db.findAllCount("subscribeUser"), function(count) {
    //     console.log("findAllCount subscribeUser  count:" + count);
    //     collectionCountList.subscribeUser = count;
    //     console.log("collectionCountList.subscribeUser :" + collectionCountList.subscribeUser);
    // }).then(function() {
    //     collectionCountList.TotalVisitor = 0;
    //     collectionCountList.totalCategory = blogs.category.length;
    //     console.log("collectionCountList.totalCategory :" + collectionCountList.totalCategory);
    //     // console.log("userregistration");
    //     // console.log("dashboard");
    //     console.log("dashboard end");
    //     res.render('dashboard', { collectionCountList: collectionCountList });
    // });

    // db.find("blogs").then(function(results) {

    //     // console.log("Blogs :" + JSON.stringify(results));
    //     var arr = [{ Name: "A", Val: 1 }, { Name: "B", Val: 1 }, { Name: "C", Val: 2 }, { Name: "D", Val: 2 }];
    //     var res = arr.groupBy(function(t) { return t.Val });
    //     collectionCountList.blogsTrends = res;
    //     console.log("Res:" + json.stringify(res));
    //     res.render('dashboard', { collectionCountList: collectionCountList });
    // });


    // db.findAllCount("subscribeUser").then(function(count) {
    //     console.log("findAllCount subscribeUser  count:" + count);
    //     collectionCountList.subscribeUser = count;
    //     console.log("collectionCountList.subscribeUser :" + collectionCountList.subscribeUser);
    // });
    // console.log("JSON.parse(blogs.category)" + (blogs.category.length));

});