var db = require('../models/db');
var ObjectId = require("mongodb").ObjectID;

// exports.category = function(cb) {
//     var collection = db.get().collection("category");

//     collection.find().toArray(function(err, results) {
//         cb(err, results);
//     });
// }

exports.category = require("../data/blogcategory.json");

//--- 1 for asc and -1 for desc

exports.allblogs = function(cb) {
    var collection = db.get().collection("blogs");

    collection.find().sort({ "creationdate": 1 }).toArray(function(err, results) {
        cb(err, results);
    });
}

exports.blogs = function(cb) {
    var collection = db.get().collection("blogs");

    collection.find({ status: { $in: ["0", "1"] } }).sort({ "creationdate": 1 }).toArray(function(err, results) {
        cb(err, results);
    });
}

exports.comments = function(cb, blogid) {
    var collection = db.get().collection("comments");

    collection.find({ blog_id: blogid }).sort({ "date": 1 }).toArray(function(err, results) {
        cb(err, results);
    });
}

exports.recentblogs = function(cb) {
    var collection = db.get().collection("blogs");

    collection.find({ status: { $in: ["0", "1"] } }).limit(10).sort({ "date": 1 }).toArray(function(err, results) {
        cb(err, results);
    });
}

exports.viewblogsbycategory = function(key) {
    return new Promise(function(resolve, reject) {
        var collection = db.get().collection("blogs");

        collection.find({ status: { $in: ["0", "1"] }, categorykey: key }).limit(10).sort({ "date": 1 })
            .toArray(function(err, info) {
                if (!err) {
                    resolve(info);
                } else {
                    reject(err);
                }
            });
    });
}

//++++++++++++++++++++++++ Methods to retirve blog specific details using Promise +++++++++++++++
exports.viewblogsbyid = function(id) {
    return new Promise(function(resolve, reject) {
        db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
            if (!err) {
                resolve([id, info]);
            } else {
                reject(err);
            }
        });
    });
}

exports.viewblogcomments = function([id, info]) {
    return new Promise(function(resolve, reject) {
        var collection = db.get().collection("comments");

        collection.find({ blog_id: id }).limit(100).sort({ "date": 1 })
            .toArray(function(err, comments) {
                if (!err) {
                    resolve([info, comments]);
                } else {
                    reject(err);
                }
            });
    });
}

exports.viewrecentblogs = function([info, comments]) {
    return new Promise(function(resolve, reject) {
        var collection = db.get().collection("blogs");

        collection.find({ status: { $in: ["0", "1"] } }).limit(10).sort({ "date": 1 })
            .toArray(function(err, mostrecentblogs) {
                if (!err) {
                    resolve([info, comments, mostrecentblogs]);
                } else {
                    reject(err);
                }
            });
    });
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++