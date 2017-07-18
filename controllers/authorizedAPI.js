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