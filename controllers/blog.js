var express = require("express");
var router = express.Router();
module.exports = router;

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
var blogs = require('../models/blogs');

var categoryList = null;

//Status 
var status = require('../data/blogstatus.json');

//Get Blog Page
router.get('/', function(req, res) {
    // blogs.category(function(err, results) {
    //     if (err) {
    //         res.status(500).send();
    //     } else {
    categoryList = blogs.category;
    blogs.blogs(function(err, results) {
        if (err) {
            res.status(500).send();
        } else {
            if (results.length == 0) {
                results = { count: 0 };
                res.render('bloggers', { title: 'Blogs', category: categoryList, blogs: results });
            } else {
                res.render('bloggers', { title: 'Blogs', category: categoryList, blogs: results });
            }
        }
    });
    //}
    //});
});

//================== Save Data =================
router.post("/savedata", function(req, res) {

    if (req.body._id != undefined && req.body._id != null) {
        var id = req.body._id;
        var topic = req.body.topic;

        db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
            if (err) {
                res.status(500).send();
            } else {
                if (info._id != undefined) {
                    db.get().collection("blogs").update({ "_id": ObjectId(info._id) }, {
                        $set: {
                            "topic": req.body.topic,
                            "content": req.body.content,
                            "categorykey": req.body.category
                        }
                    }, { upsert: true }, (err, results) => {
                        if (err) {
                            res.status(500).send();
                        } else {
                            console.log("Blog details updated Successfully");

                            //Add update history 
                            db.get().collection("bloghistory").save({
                                "blog_id": info._id,
                                "topic": req.body.topic,
                                "content": req.body.content,
                                "categorykey": req.body.category,
                                "modifiedby": req.body.modifiedby,
                                "modifydate": new Date().toUTCString(),
                                "status": req.body.status
                            }, (err, results) => {
                                if (err) {
                                    console.log("Failed to updated History");
                                    res.status(500).send();
                                } else {
                                    console.log("Blog History Table is updated successfuly");
                                }
                            });

                            blogs.blogs(function(err, results) {
                                if (err) {
                                    res.status(500).send();
                                } else {
                                    if (results.length == 0) {
                                        results = { count: 0 };
                                        res.render('bloggers', { title: 'Blogs', isBlogUpdated: false, category: categoryList, blogs: results });
                                    } else {
                                        res.render('bloggers', { title: 'Blogs', isBlogUpdated: true, category: categoryList, topic: topic, blogs: results });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    db.get().collection("blogs").save(req.body, (err, results) => {
                        if (err) {
                            res.status(500).send();
                        } else {
                            console.log("blogs details Saved Successfully");
                            blogs.blogs(function(err, results) {
                                if (err) {
                                    res.status(500).send();
                                } else {
                                    if (results.length == 0) {
                                        results = { count: 0 };
                                        res.render('bloggers', { title: 'Blogs', isBlogAdded: false, category: categoryList, blogs: results });
                                    } else {
                                        req.body = "";
                                        res.render('bloggers', { title: 'Blogs', isBlogAdded: true, category: categoryList, blogs: results });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        db.get().collection("blogs").save({
            "topic": req.body.topic,
            "content": req.body.content,
            "categorykey": req.body.category,
            "createdby": req.body.createdby,
            "creationdate": new Date().toUTCString(),
            "status": status.pending
        }, (err, results) => {
            if (err) {
                res.status(500).send();
            } else {
                console.log("Blog Data Saved Successfully");
                blogs.blogs(function(err, results) {
                    if (err) {
                        res.status(500).send();
                    } else {
                        if (results.length == 0) {
                            results = { count: 0 };
                            res.render('bloggers', { title: 'Blogs', isBlogAdded: false, blogs: results });
                        } else {
                            req.body = "";
                            res.render('bloggers', { title: 'Blogs', isBlogAdded: true, category: categoryList, blogs: results });
                        }
                    }
                });
            }
        });
    }
    //}
    //});
});

//================== Delete Blog =================
router.get('/delete/:_id', function(req, res) {
    var id = req.params._id;

    db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
        if (err) {
            res.status(500).send();
        } else {
            if (info._id != undefined) {
                topic = info.topic;

                db.get().collection('blogs').update({ "_id": ObjectId(info._id) }, {
                    $set: {
                        "status": status.deleted
                    }
                }, { upsert: true }, function(err, contacts) {
                    if (err) {
                        res.status(500).send();
                    } else {
                        console.log("Blogs deleted Successfully");

                        //Add update history 
                        db.get().collection("bloghistory").save({
                            "blog_id": info._id,
                            "topic": req.body.topic,
                            "content": req.body.content,
                            "categorykey": req.body.category,
                            "modifiedby": req.body.modifiedby,
                            "modifydate": new Date().toUTCString(),
                            "status": req.body.status
                        }, (err, results) => {
                            if (err) {
                                console.log("Failed to updated History");
                                res.status(500).send();
                            } else {
                                console.log("Blog History Table is updated successfuly");
                            }
                        });

                        blogs.blogs(function(err, results) {
                            if (err) {
                                res.status(500).send();
                            } else {
                                res.render('bloggers', { title: 'Blogs', isBlogDeleted: true, topic: topic, category: categoryList, blogs: results });
                            }
                        });
                    }
                });
            }
        }
    });
});

//================== Edit User =================
router.get('/edit/:_id', function(req, res) {
    var id = req.params._id;

    db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
        if (err) {
            res.status(500).send();
        } else {
            res.render('bloggers', { title: 'Blogs', selectedBlogForEdit: true, category: categoryList, blogs: info });
        }
    });
});