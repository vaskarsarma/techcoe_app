var db = require('../models/db');

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