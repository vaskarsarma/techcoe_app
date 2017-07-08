var express = require("express");
var router = express.Router();
module.exports = router;

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
var blogs = require('../models/blogs');

let getblogdetails = (id, res) => {
    blogs.viewblogsbyid(id)
        .then(blogs.viewblogcomments)
        .then(blogs.viewrecentblogs)
        .then(([info, comments, mostrecentblogs]) => {
            res.render('viewblog', {
                layout: 'layout',
                title: info.topic,
                blog: info,
                comments: comments,
                mostrecentblogs: mostrecentblogs
            });
        }).catch(function(e) {
            console.log("Exception " + e);
            res.status(500).send();
        });
}

//Get Blog details
router.get('/showdetails/:_id', function(req, res) {
    var id = req.params._id;

    getblogdetails(id, res);

    // blogs.viewblogsbyid(id)
    //     .then(blogs.viewblogcomments)
    //     .then(blogs.viewrecentblogs)
    //     .then(([info, comments, mostrecentblogs]) => {
    //         res.render('viewblog', {
    //             layout: 'layout',
    //             title: info.topic,
    //             blog: info,
    //             comments: comments,
    //             mostrecentblogs: mostrecentblogs
    //         });
    //     }).catch(function(e) {
    //         console.log("Exception " + e);
    //         res.status(500).send();
    //     });

    // db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
    //     if (err) {
    //         res.status(500).send();
    //     } else {

    //         var mostrecentblogs = null;
    //         blogs.recentblogs(function(err, recentblogs) {
    //             if (err) {
    //                 res.status(500).send();
    //             } else {
    //                 mostrecentblogs = recentblogs;
    //             }
    //         });

    //         blogs.comments(function(err, comments) {
    //             if (err) {
    //                 res.status(500).send();
    //             } else {
    //                 res.render('viewblog', { layout: 'layout', title: info.topic, blog: info, comments: comments, mostrecentblogs: mostrecentblogs });
    //             }
    //         }, id);
    //     }
    // });
});

//Add Blog Comments details
router.post('/addcomments', function(req, res) {
    var id = req.body._id;

    db.get().collection("comments").save({
        "blog_id": id,
        "addedby": req.body.addedby,
        "blogcomment": req.body.blogcomment,
        "date": new Date().toUTCString()
    }, (err, results) => {
        if (err) {
            res.status(500).send();
        } else {
            console.log("Blog Comments Saved Successfully");

            getblogdetails(id, res);

            // db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
            //     if (err) {
            //         res.status(500).send();
            //     } else {
            //         if (info.length == 0) {
            //             info = { count: 0 };
            //             res.render('viewblog', { layout: 'layout', title: info.topic, blog: info });
            //         } else {
            //             var mostrecentblogs = null;
            //             blogs.recentblogs(function(err, recentblogs) {
            //                 if (err) {
            //                     res.status(500).send();
            //                 } else {
            //                     mostrecentblogs = recentblogs;
            //                 }
            //             });

            //             blogs.comments(function(err, comments) {
            //                 if (err) {
            //                     res.status(500).send();
            //                 } else {
            //                     res.render('viewblog', { layout: 'layout', title: info.topic, blog: info, comments: comments, mostrecentblogs: mostrecentblogs });
            //                 }
            //             }, id);
            //         }
            //     }
            // });
        }
    });
});