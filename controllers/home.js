var express = require("express");
var router = express.Router();
module.exports = router;
var _ = require("lodash");

var blogs = require('../models/blogs');

var logs = require("../models/loggers");

//Get Home Page
router.get('/home', function(req, res) {

    categoryList = blogs.category;
    res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList });

    // blogs.blogsbySI(function(err, results) {
    //     if (err) {
    //         logs.logger.error("Error while retriving blogs details. Error " + err);
    //         res.status(500).send();
    //     } else {
    //         if (results.length == 0) {
    //             logs.logger.info("No blogs avaialble");
    //             results = { count: 0 };
    //             res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results });
    //         } else {
    //             logs.logger.info("Successfully retrived blogs details");
    //             var nextIndex = 0;
    //             _.forEach(results, function(result) {
    //                 nextIndex = result.index
    //             });
    //             res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results, index: nextIndex });
    //         }
    //     }
    // }, 0, "all");
});

// router.get('/home/:key', function(req, res) {
//     var key = req.params.key;
//     categoryList = blogs.category;
//     blogs.viewblogsbycategory(key).then((results) => {
//         if (results.length == 0) {
//             results = { count: 0 };
//             res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results });
//         } else {
//             res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results });
//         }
//     }).catch((e) => {
//         console.log("Exception " + e);
//         res.status(500).send();
//     });
// });

// router.get('/home/:nextindex', function(req, res) {
//     var nextindex = req.params.nextindex;
//     categoryList = blogs.category;
//     blogs.loadblogbyindex(nextindex).then((results) => {
//         if (results.length == 0) {
//             results = { count: 0 };
//             res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results });
//         } else {
//             res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results });
//         }
//     }).catch((e) => {
//         console.log("Exception " + e);
//         res.status(500).send();
//     });
// });