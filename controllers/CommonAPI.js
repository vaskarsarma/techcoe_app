var express = require("express");
var router = express.Router();
module.exports = router;
var _ = require("lodash");

var blogs = require('../models/blogs');

router.get("/data/countries", function(req, res) {
    res.json(require("../data/countries.json"));
});

router.post("/data/blog", function(req, res) {
    var id = req.body.si;
    var ct = req.body.ct;

    blogs.blogsbySI(function(err, results) {
        if (!err) {
            console.log("data-blog " + results.length);

            var nextIndex = 0;
            _.forEach(results, function(result) {
                nextIndex = result.index
            });

            var data = { "index": nextIndex, "blogs": results };

            //console.log(JSON.stringify(results));
            res.json(data);
        } else
            console.log(err);
    }, id, ct);

    // db.find("blogs", userFilter).then(data => {
    //     // collectionCountList.userData = data[0];
    //     // collectionCountList.subscribeUserData = data[1];
    //     // res.json(collectionCountList);
    // });
});